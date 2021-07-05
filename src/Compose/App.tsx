import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useEffect } from 'react';
import SimpleMDE from "react-simplemde-editor";
import twemoji from 'twemoji'
import { Input } from './Input';
import { useAuth } from '../Init';
import { useAccounts, useCreateEmail, useEmail, useGroups, useUpdateEmail } from '../lib/Queries';
import { useHistory, useParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw'
import axios from 'axios';
import ReactMarkdown from 'react-markdown'
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';

type Props = {
  fromDraft?: boolean
}

export const App: FC<Props> = ({ fromDraft }: Props) => {
  const [value, setValue] = useState("Initial value");
  const [sending, setSending] = useState<boolean>(false);
  const [to, setTo] = useState<{name: string, id: string}[]>([])
  const [from, setFrom] = useState<{name: string, id: string}[]>([])
  const [subject, setSubject] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [loadedDraft, setLoadedDraft] = useState<boolean>(false)
  const { id } = useParams<{id: string}>();
  const [draftId, setDraftId] = useState<string>('')
  const auth = useAuth()
  const email: any = fromDraft ? useEmail(id) : () => { }
  const history = useHistory();
  
  useEffect(() => {
    if (fromDraft && !email.isLoading && !loadedDraft) {
      if (email.data.fields.status !== 'draft') history.replace(`/email/${id}`)
      if (email.data.fields.body) setValue(email.data.fields.body)
      if (email.data.fields.to) setTo(JSON.parse(email.data.fields.to))
      if (email.data.fields.from) setFrom(JSON.parse(email.data.fields.from))
      if (email.data.fields.subject) setSubject(email.data.fields.subject)
      setLoadedDraft(true)
    }
  }, [email])
  const createEmail = useCreateEmail()
  const updateEmail = useUpdateEmail(id || draftId)

  const createDraft = useCallback(_.debounce((draft) => {
      createEmail.reset()
      createEmail.mutate(draft)
    }, 1000), []
  )

  const updateDraft = useCallback(_.debounce((draft) => {
    updateEmail.reset()
    updateEmail.mutate(draft)
  }, 1000), []
)

  useEffect(() => {
    if (createEmail.isSuccess) {
      setDraftId(createEmail.data[0].id)
    }
    if (createEmail.isLoading) setSaving(true)
    else setSaving(false)
    if (updateEmail.isLoading) setSaving(true)
    else setSaving(false)
  }, [createEmail, updateEmail])

  const saveDraft = () => {
    if (saving) return
    if (!to.length && !from.length && !subject && value === 'Initial value') return
    if (!id && !draftId) {
      createDraft({
        status: 'draft',
        subject,
        to: JSON.stringify(to),
        from: JSON.stringify(from),
        body: value
      })
    } else {
      updateDraft({
        status: 'draft',
        subject,
        to: JSON.stringify(to),
        from: JSON.stringify(from),
        body: value
      })
    }
  }

  useEffect(() => {
    saveDraft()
  }, [to, from, subject])

  const onChange = (value: string) => {
    saveDraft()
    setValue(value);
  };

  const { data, isLoading, isError, isSuccess } = useGroups()
  const accounts = useAccounts()

  const sendEmail = () => {
    if (sending) return
    setSending(true);
    axios.post(
      `/api/send-email`,
      {
        emailId: id || draftId,
        body: value,
        to: to.map(t => t.id),
        id: from ? from[0].id : '',
        subject
      },
      {
        headers: {
          Authorization: `Bearer ${auth?.user?.token?.access_token}`
        }
      }
    ).then((res) => {
      console.log(res);
      setSending(false)
      history.push(`/emails`)
    }).catch((err) => {
      console.log(err.response.data)
    })
  }

  const options = useMemo(() => {
    return {
      sideBySideFullscreen: false,
      previewClass: 'prose p-2',
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        'heading-1',
        'heading-2',
        'heading-3',
        'code',
        'quote',
        'unordered-list',
        'ordered-list',
        'clean-block',
        'link',
        'image',
        'table',
        'horizontal-rule',
        'preview',
        'side-by-side',
        'fullscreen',
        'guide',
        {
          name: 'signatures',
          title: 'Signatures',
          className: 'fa fa-pencil'
        },
        {
          name: 'attachments',
          title: 'Attachments',
          className: 'fa fa-paperclip'
        }
      ]
    };
  }, []);

  useEffect(() => {
    twemoji.parse(document.body)
  }, [value])

  return (<>
    <div className="w-full h-full flex items-center justify-center pb-4">
      <div className="w-full space-y-6 relative">
        <div className="absolute top-0 right-0">
          {
            saving ? <div className="flex space-x-3">
              <span className="font-semibold italic">Saving...</span>
              <svg className="animate-spin text-rose-600 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div> : (id || draftId) ? <span className="font-semibold italic">Draft Saved</span> : ''
          }
        </div>
        {isLoading ? <div className="w-full h-16 rounded-lg bg-gray-200 animate-pulse"></div> : <Input 
        title="To Whom 🤔"
        helper="Use email addresses or your preset distribution groups."
        options={data}
        offMenu={/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/}
        setInput={setTo}
        input={to}
        />}
        <div className="flex w-full space-x-4 items-end">
          <div className="w-full space-y-2">
            <p className="font-black text-lg">Subject 💭</p>
            <p className="italic text-sm"> </p>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="apperance-none text-lg p-2 rounded-lg border border-blueGray-400 w-full my-1" />
          </div>
        {accounts.isLoading ? 
          <div className="w-full h-16 rounded-lg bg-gray-200 animate-pulse"></div> :
          <Input 
          title="From Whom 😃"
          helper="Choose one of your preset email addresses, or use Cherrio's default outbound email."
          options={accounts.data}//Get accounts from netlify funciton -> get from airtable
          max={1}
          setInput={setFrom}
          input={from}
          />
        }
        </div>
        {/* {ReactDOMServer.renderToStaticMarkup(<ReactMarkdown children={value} rehypePlugins={[rehypeRaw]} />)} */}
        <SimpleMDE value={value} onChange={onChange} options={options}/>
        <div className="w-full flex justify-end space-x-6">
          <div className="flex items-center space-x-2">
            <div 
            onClick={sendEmail}
            className="h-12 w-36 flex items-center justify-center bg-rose-500 text-white rounded-lg font-semibold cursor-pointer transform transition-all duration-150 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {sending ? <svg className="animate-spin text-rose-100 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> : <span>Send Email ✈️</span>}
            </div>
          </div>
          <div 
            onClick={saveDraft}
            className="h-12 w-36 flex items-center justify-center bg-rose-500 text-white rounded-lg font-semibold cursor-pointer transform transition-all duration-150 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              {saving ? <svg className="animate-spin text-rose-100 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> : <span>Save Draft</span>}
            </div>
        </div>
      </div>
    </div>
  </>);
}