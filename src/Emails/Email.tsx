import React from 'react'
import rehypeRaw from 'rehype-raw'
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEmail } from '../lib/Queries';
import { timeSince } from '../lib/utils';
import {render} from 'react-dom'
import MarkdownPreview from '@uiw/react-markdown-preview';
import marked from 'marked'

export const Email = () => {
  const { id } = useParams<{id: string}>();
  const { data, isLoading, isSuccess, isError } = useEmail(id)
  return (<>
    { isLoading ? <p>Loading...</p> : <div className="space-y-4">
      <div className="flex space-x-4 items-baseline">
        <p className="font-black text-2xl">Sent to: </p>
        <p className="w-96 truncate">{data.fields.accepted}</p>
      </div>
      <div className="flex space-x-4 items-baseline">
        <p className="font-black text-2xl">Rejected: </p>
        <p className="w-96 truncate">{data.fields.rejected}</p>
      </div>
      <div className="flex space-x-4 items-end">
        <p className="font-black text-2xl">Message ID: </p>
        <code className="bg-gray-200 p-1 rounded-sm">{data.fields.messageId}</code>
      </div>
      <div className="flex space-x-4 items-end">
        <p className="font-black text-2xl">Status: </p>
        <p className="w-96 truncate">{data.fields.status}</p>
      </div>
      <div className="flex space-x-4 items-end">
        <p className="font-black text-2xl">Last Updated: </p>
        <p className="w-96 truncate">{timeSince(data.fields.lastModified)} ago</p>
      </div>
        <article className="prose" dangerouslySetInnerHTML={{ __html: marked(data.fields.body)}} /> 
    </div>
    }
  </>)
}