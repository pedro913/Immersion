import memoize from 'memoizee'

import { useEffect, useRef, useState } from 'react'

import md5 from 'md5'

export const range = (n) => [...Array(n).keys()]

const defaultTranslations = {
  _: '',
  h: { opacity: 0 },
  v: { opacity: 1 },
  p: { opacity: 0.3 },
  d: { drawSVG: 0 },
  D: { drawSVG: '0 100%' },
  x: true
}

export function timeline(obj) {
  const stepsByKey = Object.entries(obj).map(([key, thing]) => {
    let steps, translations
    if (typeof thing == 'string') {
      steps = thing
      translations = {}
    } else {
      ;[steps, translations = {}] = thing
    }
    const translated = []
    let number = 0
    const translate = (s) =>
      translations.hasOwnProperty(s)
        ? translations[s]
        : defaultTranslations.hasOwnProperty(s)
        ? defaultTranslations[s]
        : s
    steps.split('').forEach((step) => {
      const prev = translated[translated.length - 1]
      if (step === ' ') {
        translated.push(prev)
        return
      }
      if (step === '+') {
        number += 1
        translated.push(translate(number))
        return
      }
      if (step === '-') {
        number -= 1
        translated.push(translate(number))
        return
      }
      // if (step === ' ') { translated.push(null); return; }

      const n = parseInt(step)
      if (!isNaN(n)) {
        number = n
        translated.push(translate(number))
        return
      }
      translated.push(translate(step))
    })
    return [key, translated]
  })

  const result = range(stepsByKey[0][1].length).map((stepIndex) => {
    return Object.fromEntries(
      stepsByKey.map(([key, steps]) => [key, steps[stepIndex]])
    )
  })
  // console.table(result)
  return result
}

export const hashString = function (str) {
  var hash = 0,
    i,
    chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

// TODO: memoize , but be more smart => each time return different id!
export const fetchLaTeXSvg = async (tex) => {
  const text = await fetchLaTeXSvghelper(tex)
  const ele = document.createElement('div')
  ele.innerHTML = text

  const svg = ele.querySelector('svg')
  if (!svg) {
    console.error(`Couldn't compile ${tex}`)
    return null
  }

  // This makes the id's of the elements in the svg unique over the whole document.
  const rootId = 'r' + Math.floor(Math.random() * 100000)
  ;[...svg.querySelectorAll('[id]')].forEach((ele) => {
    ele.classList.add(ele.id)
    ele.id = rootId + ele.id
  })

  // Fix use tags
  ;[...svg.querySelectorAll('use')].forEach((ele) => {
    const selector = ele.getAttribute('xlink:href')
    const originalId = selector.slice(1)
    ele.setAttribute('xlink:href', '#' + rootId + originalId)
  })

  return svg
}

// TODO!
const fetchLaTeXSvghelper = (() => {
  const cacheBust = 8
  const environment = process.env.NODE_ENV
  if (environment === 'development') {
    const HOST = `http://${window.location.hostname}:3001`
    // const HOST = 'https://latex-web-nbaek4micq-ew.a.run.app'
    return memoize((tex) =>
      fetch(
        `${HOST}/latex?cachebust=${cacheBust}&tex=${encodeURIComponent(tex)}`
      ).then((res) => res.text())
    )
  } else if (environment === 'production') {
    return memoize((tex) => {
      const filename = `${cacheBust}${md5(tex)}.svg`
      return fetch(`/latex/${filename}`).then((res) => res.text())
    })
  } else {
    // unrecognized environment
  }
})()

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// Hook
export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }
  return [storedValue, setValue]
}
