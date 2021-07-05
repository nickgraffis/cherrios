import React from 'react'
import rehypeRaw from 'rehype-raw'
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { html } from './help.md';

export const Help = () => {
  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: html}} /> 
  )
}