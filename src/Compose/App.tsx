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
import { useToasts } from '../Toast/Toast';

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
  const [unsubscribeLink, setUnsubscribeLink] = useState<boolean>(true)
  const [sendType, setSendType] = useState<boolean>(true)

  const { add }: any = useToasts()
  
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

    setTimeout(() => {
      add('This may take some time...')
    }, 1000)
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
        <div className="w-full flex justify-between">
          <div className="relative">
            <div className="absolute -top-36 left-0 bg-white shadow-lg rounded-lg p-4 space-y-4">
              <div className="flex p-2 space-x-4 items-center">
                <div onClick={() => setUnsubscribeLink(!unsubscribeLink)} className={`transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95 flex items-center justify-center w-5 h-5 rounded-md border-2 border-gray-700 cursor-pointer ${unsubscribeLink ? 'bg-rose-500' : 'bg-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 text-white w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-bold whitespace-nowrap">Add unsibscribe link</p>
              </div>
              <div onClick={() => setSendType(!sendType)} className="flex space-x-4 items-center p-2 hover:bg-gray-300 rounded-md cursor-pointer">
                { sendType ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg> }
                <p className="font-bold whitespace-nowrap">Using { sendType ? 'BCC' : 'CC' } for recipients</p>
              </div>
            </div>
            <div className="px-4 py-2 flex items-center justify-center bg-rose-500 text-white font-semibold rounded-lg">Advanced Settings</div>
          </div>
          <div className="flex space-x-6">
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
    </div>
  </>);
}