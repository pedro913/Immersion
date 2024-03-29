import React from 'react'
import { useEffect, useState, useRef, useContext } from 'react'

import { useLocalStorage } from './utils'
import Morph from './Morph'

import './AnimationEditor.css'
// import localStorageData from './localStorage.json'

const allColors = [
  '#D32F2F',
  '#7B1FA2',
  '#512DA8',
  '#303F9F',
  '#1976D2',
  '#0288D1',
  '#0097A7',
  '#00796B',
  '#388E3C',
  '#689F38',
  '#AFB42B',
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19'
]

function convertToTeX(tex, selections) {
  return (
    tex
      .split('')
      .map((c, i) => {
        const ending = selections.filter(([c, s, e]) => e === i)
        const starting = selections
          .filter(([c, s, e]) => s === i)
          .sort((a, b) => b[3] - a[3]) // descending on `end`
          .map(([c, s, e]) => c)

        return (
          ending.map((e) => '}').join('') +
          starting.map((col) => `\\g{${col + 1}}{`).join('') +
          c
        )
      })
      .join('') +
    selections
      .filter(([c, s, e]) => e === tex.length)
      .map((e) => '}')
      .join('')
  )
}

export const lookupAnimationGroups = (() => {
  // TODO: use hashmap?
  return (start, end) => {
    const data = JSON.parse(localStorage.animationGroups || '[]')
    const result = data.find(({ start: s, end: e }) => {
      return (start === s && end === e) || (start === e && end === s)
    })

    // no result found
    if (!result) {
      return [start, end]
    }

    if (result.start === start) {
      // not reversed
      return [
        convertToTeX(result.start, result.startGroups),
        convertToTeX(result.end, result.endGroups)
      ]
    } else {
      // reversed
      return [
        convertToTeX(result.end, result.endGroups),
        convertToTeX(result.start, result.startGroups)
      ]
    }
  }
})()

export default function AnimationEditor({ animations: playedAnimations }) {
  const [animations, setAnimations] = useLocalStorage('animationGroups', [])
  const [colorIndex, setColorIndex] = useState(0)

  const onKeyPress = (e) => {
    try {
      const i = parseInt(e.key, 10)
      setColorIndex((i + 9) % 10)
    } catch (e) {}
  }
  useEffect(() => {
    window.addEventListener('keypress', onKeyPress)
    return () => window.removeEventListener('keypress', onKeyPress)
  }, [])

  useEffect(() => {
    const newOnes = playedAnimations
      .filter((animation) => {
        const animated = animations.find(
          (a) =>
            (animation.start == a.start && animation.end == a.end) ||
            (animation.start == a.end && animation.end == a.start)
        )
        const inDataBase = !animated
        return inDataBase
      })
      .map((anim) => ({
        ...anim,
        startGroups: [],
        endGroups: []
      }))

    if (newOnes.length >= 1) {
      setAnimations((animations) => [...animations, ...newOnes])
    }
  }, [animations, setAnimations, playedAnimations])

  return (
    <div className='animation-editor'>
      <div className='colors'>
        {allColors.map((c, i) => (
          <span
            key={i}
            className='color'
            style={{
              backgroundColor: c,
              transform: colorIndex === i ? 'scale(1.4)' : 'scale(1)'
            }}
            onClick={() => setColorIndex(i)}
          ></span>
        ))}
      </div>
      <style>{` .formula *::selection { background: ${allColors[colorIndex]} } `}</style>

      <div className='animations'>
        {playedAnimations
          .map((animation) => {
            const index = animations.findIndex(
              (a) =>
                (animation.start == a.start && animation.end == a.end) ||
                (animation.start == a.end && animation.end == a.start)
            )

            const a = animations[index]

            if (!a) return null

            return {
              ...a,
              start: '' + a.start,
              end: '' + a.end,
              index
            }
          })
          .filter(Boolean)
          .map((animation) => {
            const i = animation.index
            return (
              <Animation
                animation={animation}
                setAnimation={(f) =>
                  setAnimations([
                    ...animations.slice(0, i),
                    f,
                    ...animations.slice(i + 1)
                  ])
                }
                removeAnimation={() =>
                  setAnimations([
                    ...animations.slice(0, i),
                    ...animations.slice(i + 1)
                  ])
                }
                colorIndex={colorIndex}
                setColorIndex={setColorIndex}
                i={i}
              />
            )
          })
          .filter(Boolean)}
      </div>
    </div>
  )
}

function Animation({
  colorIndex,
  setColorIndex,
  animation,
  setAnimation,
  i,
  removeAnimation
}) {
  const handleSelection = (ev, part, background) => {
    //remove
    if (ev.button === 2) {
      const index = ev.target.dataset.index
      const groups = part + 'Groups'
      const selections = determineSelections(animation[part], animation[groups])
      const activeSelection = selections[index]

      if (!activeSelection) {
        return
      }

      setAnimation({
        ...animation,
        [groups]: animation[groups].filter((s) => s !== activeSelection)
      })

      return
    }

    // pick color
    if (ev.button === 1) {
      ev.preventDefault()
      const group = ev.target.dataset.group
      setColorIndex(+group)
      return
    }

    const sel = window.getSelection()

    try {
      var s =
        parseInt(sel.anchorNode.parentNode.dataset.index, 10) + sel.anchorOffset
      var e =
        parseInt(sel.focusNode.parentNode.dataset.index, 10) + sel.focusOffset
      var start = Math.min(s, e)
      var end = Math.max(s, e)
      if (start === end) {
        return
      }
      const newAnimation = {
        ...animation,
        [part + 'Groups']: mergeSelections([
          ...animation[part + 'Groups'],
          [colorIndex, start, end]
        ])
      }

      // TODO
      // "smart" stuff
      // if (part === 'start') {
      //   const text = formula.tex.substring(start, end)
      //   if (text.length > 2 && nextFormula.tex.includes(text)) {
      //     // setting formula
      //     const startIndex = nextFormula.tex.indexOf(text);
      //     const newSelection = {
      //       start: startIndex,
      //       end : startIndex + text.length,
      //       color: color
      //     }
      //     newFormula.end = [...newFormula.end, newSelection]
      //   }
      // }

      setAnimation(newAnimation)
    } catch (e) {
      console.error(e)
    } finally {
      sel.removeAllRanges()
    }
  }

  // return <pre>{JSON.stringify(animation)}</pre>;

  return (
    <div className='animation' style={{}}>
      {['start', 'end'].map((part) => {
        const groups = part + 'Groups'
        const selections = determineSelections(
          animation[part],
          animation[groups]
        )
        return (
          <div>
            <span
              className='formula'
              style={{ fontFamily: 'Iosevka Term, monospace' }}
              onMouseUp={(e) => handleSelection(e, part, selections)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {animation[part].split('').map((c, j) => {
                const color =
                  null === selections[j] ? 'black' : allColors[selections[j][0]]
                const group = null === selections[j] ? -1 : selections[j][0]
                return (
                  <span
                    data-index={j}
                    data-group={group}
                    style={{ background: color }}
                  >
                    {c}
                  </span>
                )
              })}
            </span>
          </div>
        )
      })}
      <div className='preview'>
        <AutoMorph
          steps={[
            convertToTeX(animation.start, animation.startGroups),
            convertToTeX(animation.end, animation.endGroups)
          ]}
        />
      </div>
      {/*}<button className='remove' onClick={removeAnimation}>⨯</button>*/}
    </div>
  )
}

function AutoMorph({ steps }) {
  const [step, setStep] = useState(0)
  const onClick = () => setStep((step) => (step + 1) % 2)

  return (
    <div className='automorph' onClick={onClick}>
      <Morph TIMING={1.0} display useAnimationDatabase={false}>
        {steps[step]}
      </Morph>
    </div>
  )
}

function determineSelections(tex, selections) {
  const colors = []
  let levels = []
  tex.split('').forEach((c, i) => {
    const ending = selections.filter(([c, s, e]) => e === i)

    const starting = selections
      .filter(([c, s, e]) => s === i)
      .sort((a, b) => b[3] - a[3]) // descending on `end`

    levels = levels.slice(0, levels.length - ending.length)
    levels = [...levels, ...starting]

    const currentActive = levels[levels.length - 1]
    if (!currentActive) {
      colors.push(null)
    } else {
      colors.push(currentActive)
    }
  })

  return colors
}

function mergeSelections(selections) {
  let result = []
  selections.forEach(([color, start, end]) => {
    const prev = result.find(([c, s, e]) => e === start && c === color)
    if (prev) {
      prev[3] = end
    } else {
      result.push([color, start, end])
    }
  })
  return result
}
