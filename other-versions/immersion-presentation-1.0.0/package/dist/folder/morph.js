import {pathParse, serializePath} from 'svg-path-parse';
import {fetchLaTeXSvg} from '../utils'

// import '../external/TweenMax.min'
import gsap from 'gsap';
import MorphSVGPlugin from 'gsap-bonus/MorphSVGPlugin';
import DrawSVGPlugin from 'gsap-bonus/DrawSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);

// temp 'hack', should add colors={[...]} to <Morph>?

const whiteListedColors = [
  '#00d56f'
]

// TODO: syntax highlighting vim per groups?
function elementToPath(child, transform='') {
  const svg = child.ownerSVGElement;
  if (child.tagName === 'use') {
    const offsetX = parseFloat(child.getAttribute('x'), 10) || 0;
    const offsetY = parseFloat(child.getAttribute('y'), 10) || 0;

    const id = child.getAttribute('xlink:href');

    const element = svg.querySelector(id)
    if (element.tagName == 'path') {
      const path = element.getAttribute('d');
      const {err, segments, type} = pathParse(path).relNormalize({
        transform: `translate(${offsetX}, ${offsetY}) ${transform}`.trim()
      });

      const newPath = serializePath({err, segments: segments, type});

      return newPath;
    } else if (element.tagName == 'use') {
      const tr = element.getAttribute('transform') || '';
      return elementToPath(element,  `translate(${offsetX}, ${offsetY}) ${tr}`.trim());
    } else {
      console.error('Unrecognized use of element', element);
    }
  }

  if (child.tagName === 'rect') {
    const x = +child.getAttribute('x');
    const y = +child.getAttribute('y');
    const width = +child.getAttribute('width');
    const height = +child.getAttribute('height');

    const pathData = 'M' + x + ' ' + y + 'H' + (x + width) + 'V' + (y + height) + 'H' + x + 'z';
    return pathData;
  }
  // TODO polyline or something like that
  console.error('Unrecognized:', child);
  return null;
}

function groupIdFromElement(element) {
  const fill = element.getAttribute('fill');
  if (!fill) {
    return 'g0';
  }
  return 'g' + fill.slice(1);
}

function colorFromGroupId(id) {
  if (id == 'g0')
    return 'black'
  return '#' + id.slice(1)
}

function svgToGroupedPaths(svg) {
  const rest = [...svg.querySelectorAll('.page1 > :not(g)')].map(child => ({
    id: groupIdFromElement(child),
    path: elementToPath(child)
  }));

  const gs = [...svg.querySelectorAll('.page1 > g')].map(group => {
    return {
      id: groupIdFromElement(group),
      path: [...group.children]
        .map(child => elementToPath(child))
        .filter(Boolean)
        .join(' ')
    };
  });

  const byGroupId = [...rest, ...gs].reduce(function(acum, {id, path}) {
    if (!acum[id]) {
      acum[id] = '';
    }
    acum[id] += ' ' + path;
    return acum;
  }, {});

  return byGroupId;
}

function colorHash(str) {
  str = String(str);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2).toUpperCase();
  }
  return colour;
}

const DEFAULT_TIMING = 0.4;

export async function animate(svgEl, text, replaceImediately=false, TIMING=DEFAULT_TIMING, setSvgData = (() => {})) {

  text = text.replace(/\\g(\d)/g, (match, p1) => `\\g{${colorHash(p1)}}`);
  text = text.replace(
    /\\g\{(.*?)\}/g,
    (match, p1) => `\\g{${colorHash(p1)}}`
  );

  let newSvg;
  if (text == '') {
    // empty svg
    newSvg = document.createElement('svg');
    newSvg.setAttribute('width', '0pt')
    newSvg.setAttribute('height', '0pt')
    newSvg.setAttribute('viewBox', '0 0 0 0')
  } else {
    newSvg = await fetchLaTeXSvg(text);
  }

  if (!newSvg) {
    return;
  }

  const newPaths = svgToGroupedPaths(newSvg);

  // svgEl.setAttribute('width', newSvg.getAttribute('width'))
  // svgEl.setAttribute('height', newSvg.getAttribute('height'))
  // svgEl.setAttribute('viewBox', newSvg.getAttribute('viewBox'))

  setSvgData({
    width: parseFloat(newSvg.getAttribute('width').replace('pt', ''), 10),
    height:parseFloat(newSvg.getAttribute('height').replace('pt', ''), 10),
    viewBox: newSvg.getAttribute('viewBox').split(' ').map(s => parseFloat(s, 10))
  })

  const afterIds = Object.keys(newPaths);
  const beforeIds = [...svgEl.querySelectorAll('[id]')].map(e => e.id);
  const allIds = [...new Set([...afterIds, ...beforeIds])];

  return Promise.all(allIds.map(id => {
    const shouldRemove = beforeIds.includes(id) && !afterIds.includes(id);
    const isNew = afterIds.includes(id) && !beforeIds.includes(id);

    if (shouldRemove) {
      const element = svgEl.querySelector(`#${id}`);
      if (replaceImediately) {
        element.remove()
        return true
      } else {
        return new Promise(res => gsap.to(element, TIMING, {
          opacity: 0,
          onComplete:() => {
            element.remove()
            res()
          }
        }))
      }
    }

    if (isNew) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.id = id;
      path.setAttribute('d', newPaths[id]);

      const color = colorFromGroupId(id)
      if (whiteListedColors.includes(color)) {
        path.setAttribute('fill', color)
      }

      path.style.opacity = 0;
      svgEl.appendChild(path);

      if (replaceImediately) {
        path.style.opacity = 1
        return true
      } else {
        return new Promise(res => gsap.to(path, TIMING, {
          opacity: 1,
          onComplete:res
        }))
      }
    }

    // morphing
    const element = svgEl.querySelector(`#${id}`);


    if (replaceImediately) {
      element.setAttribute('d', newPaths[id]);
      element.style.opacity = 1;
      return true
    } else {
      return new Promise(res => gsap.to(element, TIMING, {
        morphSVG: newPaths[id],
        // TODO test if makes difference!
        // type:"rotational",
        opacity: 1,
        onComplete: res
      }))
    }
  }));
}
