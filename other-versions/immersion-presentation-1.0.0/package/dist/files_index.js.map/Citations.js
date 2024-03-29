import React from 'react'
import { useEffect, useState, useContext } from 'react'

import Citation from 'citation-js'

export const CitationContext = React.createContext(null)

export function CitationProvider({ bibUrl, citationMap, children }) {
  const [bibliography, setBibliography] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (!bibUrl) {
        return
      }
      const text = await fetch(bibUrl).then((res) => res.text())
      const result = Citation.parse.bibtex.text(text)
      setBibliography(result)
    })()
  }, [])

  return (
    <CitationContext.Provider
      value={{
        bibliography,
        citationMap
      }}
    >
      {children}
    </CitationContext.Provider>
  )
}

export function RenderCite({ id, render }) {
  const { citationMap, bibliography } = useContext(CitationContext)

  return render({
    text: bibliography
      ? new Citation(bibliography.find((e) => e.label === id)).format(
          'bibliography',
          {
            format: 'text',
            template: 'apa',
            lang: 'en-US'
          }
        )
      : null,
    number:
      bibliography && !bibliography.find((e) => e.label === id)
        ? `?? ${id}`
        : citationMap[id] || null
  })
}

export function RenderBibliography({ render }) {
  const { citationMap, bibliography } = useContext(CitationContext)
  // TODO: Slide header should work here!

  const sortedEntries = Object.entries(citationMap).sort(
    ([i1, n1], [i2, n2]) => n1 - n2
  )

  if (!bibliography) return render([])
  return render(
    sortedEntries.map(([id, n]) => {
      const entry = bibliography.find((e) => e.label === id)
      const html = new Citation(entry).format('bibliography', {
        format: 'html',
        template: 'apa',
        lang: 'en-US'
      })
      return { id, n, html }
    })
  )
}
