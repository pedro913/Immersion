import React, { useEffect, useRef } from 'react'

import memoize from 'memoizee'

import { animate } from './lib/morph'

import gsap from 'gsap'
import MorphSVGPlugin from 'gsap-bonus/MorphSVGPlugin'
import DrawSVGPlugin from 'gsap-bonus/DrawSVGPlugin'

gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin)

/* global fetch */

const positionSvg = (textSvg: SVGElement): void => {
  // This function posititions the generated svg of some LaTeX code correctly in the parent svg.

  const [, vy, ,] = textSvg
    .getAttribute('viewBox')!
    .split(' ')
    .map((s) => parseFloat(s))
  const width = parseFloat(textSvg.getAttribute('width')!.replace('pt', ''))
  const height = parseFloat(textSvg.getAttribute('height')!.replace('pt', ''))

  const {
    scale: scaleString,
    textX: textXString,
    textY: textYString
  }: {
    scale?: string
    textX?: string
    textY?: string
  } = textSvg.dataset

  const FONT_SCALING_FACTOR = 2
  const scale = parseFloat(scaleString || '0')
  const textX = parseFloat(textXString || '0')
  const textY = parseFloat(textYString || '0')

  // The (x, y) of the text refers to the text anchor.
  // The (x, y) of the svg refers to the top left corner
  // Therefore, as the base line of the svg generated by latex is (0, 0),
  // we translate the svg by vy, keeping in mind the SCALE and the conversion between px and pt (*1.3)

  textSvg.dataset.scale = String(scale)

  textSvg.setAttribute('x', textX + 'px')
  textSvg.setAttribute(
    'y',
    textY + FONT_SCALING_FACTOR * scale * vy * 1.3 + 'px'
  )
  textSvg.setAttribute('width', FONT_SCALING_FACTOR * scale * width + 'pt')
  textSvg.setAttribute('height', FONT_SCALING_FACTOR * scale * height + 'pt')
}

const replaceText = async (textEle: SVGGraphicsElement) => {
  const text = textEle.textContent
  if (!text) return

  const textSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  // To make all text properly sized, we calculate the transformation matrix of the element.
  // It is very important that the element is in the DOM (see (1))
  // Otherwise, getScreenCTM returns null
  const matrix = textEle.getScreenCTM()

  if (!matrix) return

  // Then we undo the scaling We're only using `a`, so we're assuming that the element is not skewed and scale uniformly ...
  // FIXME later?
  // a c e
  // b d f
  // 0 0 1

  const scale = 1 / matrix.a

  textSvg.dataset.textX = textEle.getAttribute('x') || undefined
  textSvg.dataset.textY = textEle.getAttribute('y') || undefined
  textSvg.dataset.scale = String(scale)

  const textContentToId = (textContent: string) =>
    textContent.replace(/[^a-zA-z]+/g, '')

  textSvg.id = textContentToId(text)

  // Finally, we replace the text node with the svg.
  textEle.parentNode!.replaceChild(textSvg, textEle)

  await animate(textSvg, text, true, 0, ({ width, height, viewBox }) => {
    textSvg.setAttribute('width', width + 'pt')
    textSvg.setAttribute('height', height + 'pt')
    textSvg.setAttribute('viewBox', viewBox.join(' '))
    positionSvg(textSvg)
  })
}

const TIMING = 0.4

// make awaitable?
function update(
  wrapper: HTMLDivElement,
  step: any,
  replaceImediately: boolean
) {
  for (const key in step) {
    if (step[key] === null || step[key] === undefined) {
      continue
    }
    if (key.startsWith('text:')) {
      const id = key.replace(/^text:/, '')
      const textSvg = wrapper.querySelector(`svg#${id}`) as SVGSVGElement
      if (textSvg) {
        if (replaceImediately) {
          // remove the placeholder of the text
          textSvg.innerHTML = ''
        }
        // TODO: use that animation groups database!
        animate(
          textSvg,
          step[key] || '',
          replaceImediately,
          0.3,
          ({ width, height, viewBox }) => {
            textSvg.setAttribute('width', width + 'pt')
            textSvg.setAttribute('height', height + 'pt')
            textSvg.setAttribute('viewBox', viewBox.join(' '))
            positionSvg(textSvg)
          }
        )
      }
    } else {
      const ele = wrapper.querySelector(`#${key}`) as SVGElement
      const { css = {}, ...rest } = step[key]
      if (ele) {
        for (const key in css) {
          ele.style[key as any] = (css as { [index: string]: any })[key]
        }

        if (replaceImediately) {
          gsap.set(ele, { ...rest })
        } else {
          console.log('timing is ', rest.seconds, TIMING)
          gsap.to(ele, {
            duration: rest.seconds || TIMING,
            ...rest
          })
        }
      }
    }
  }
}

// Cache the images
const memoizedFetch = memoize(
  (src: string): Promise<string> => fetch(src).then((r) => r.text())
)

type AnimateSVGStep = {
  css?: React.CSSProperties
  [key: string]: any
}

type AnimateSVGProps = {
  src: string
  step: AnimateSVGStep
  width: string | number
  height: string | number
}

function AnimateSVG({
  src,
  step = {},
  width = '100%',
  height = 'auto'
}: AnimateSVGProps): React.ReactNode {
  const element = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    ;(async () => {
      // Load the svg
      const text = await memoizedFetch(src)
      const div = element.current
      if (!div) return

      div.style.opacity = '0'
      // (1)
      div.innerHTML = text
      div.querySelector('svg')!.style.width = width as string
      div.querySelector('svg')!.style.height = height as string

      // Replace text
      await Promise.all(
        Array.from(div.querySelectorAll('text')).map(async (textEle) => {
          if (textEle.matches('.dont-replace *')) {
            return
          }

          // Simply <text></text>
          if (textEle.children.length === 0) {
            await replaceText(textEle)
          } else {
            // Text of the form <text><tspan></tspan> ... <tspan></tspan></text>
            const g = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'g'
            )

            // replace text
            await Promise.all(
              Array.from(textEle.children).map((el) =>
                replaceText(el as SVGGraphicsElement)
              )
            )
            // Put the svgs from the replaced text in a group
            Array.from(textEle.children).forEach((e) => g.appendChild(e))

            // Replace <text><tspan/><tspan/>...</text> element with <g><svg/><svg/>...</g>
            textEle.parentNode!.replaceChild(g, textEle)
          }
        })
      )

      // Set the correct opacity, ... of the elements
      if (element.current) {
        update(element.current, step, true)
      }

      // Fade in the picture
      div.style.transition = '0.3s opacity'
      div.style.opacity = '1'
    })()
  }, [element.current])

  // When the step changes, animate the new opacities
  useEffect(() => {
    if (!element.current) return

    update(element.current, step, false)
  }, [step, element])

  return (
    <div
      ref={element}
      style={{
        margin: '-1rem'
      }}
    />
  )
}

export default AnimateSVG
