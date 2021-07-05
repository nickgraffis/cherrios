import React from 'react'
import rehypeRaw from 'rehype-raw'
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

export const EmailView = () => {
  const { id } = useParams<{id: string}>();
  const [value, setValue] = useState('')
  useEffect(() => {
    axios.get(`/api/emails/${id}`).then(res => {
      console.log(res)
      setValue(res.data.record.fields.body)
    }).catch(err =>{
      console.log(err)
    })
  }, [])

  return (
    <ReactMarkdown children={value} rehypePlugins={[rehypeRaw]} />
  )
}