import React from "react";

/* eslint-disable jsx-a11y/iframe-has-title, jsx-a11y/alt-text,  */
/* eslint-disable no-unused-vars */

import { useState } from "react";

import {
  AnimateSVG,
  Morph,
  m,
  M,
  Show,
  Notes,
  Portal,
  timeline,
  range,
  themes,
} from "immersion-presentation";

import "immersion-presentation/dist/index.css";
import step from "immersion-presentation/dist/step.macro.js";

const {
  Presentation,
  Slide,
  BibliographySlide,
  TitleSlide,
  TableOfContentsSlide,
  SectionSlide,
  QuestionSlide,
  ConclusionSlide,
  Figure,
  List,
  Item,
  Cite,
  Box,
  Qed,
} = themes.modern;

function App() {
  return (
    <Presentation>
      <TitleSlide title="Title" names="Name 1" names2="Name 2" date="Date">
      </TitleSlide>
      
      <Slide>
        <Notes>
          Remember to talk about the origin of the equality symbol
        </Notes>

        <List>
          <Item>
            Item 1
          </Item>
          <Item>
            Item 2
          </Item>
         <Item>
            Item 3
          </Item>
        </List>

        <Box> 
          Theorem. This is inside a box.
        </Box>

      </Slide>
    </Presentation>
  );
}

export default App;
