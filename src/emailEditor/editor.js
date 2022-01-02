import React, { useRef, useState } from 'react'
import EmailEditor from 'react-email-editor'
import QuickMediaLibrary from 'components/specific/quickMediaLibrary'
import Modal from '@mui/material/Modal'

export default (props) => {
    const {
        onSaved,
        closeModal,
        initialDesign
    } = props

    const editor = useRef(null)
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false)
    const mediaDone = useRef()
    const onClose = () => {
        closeModal()
    }

    const onLoad = () => {


        if (!initialDesign) {
            return
        }

        if (!editor.current) {
            return
        }

        // editor.current.registerTab({
        //     name: 'my_tab',
        //     label: 'My Tab',
        //     icon: 'fa-smile',
        //     supportedDisplayModes: ['web', 'email'],
        //     renderer: {
        //         Panel: editor.current.createPanel({
        //             render() {
        //                 return "<div>I am a custom tab.</div>"
        //             }
        //         }),
        //     }
        // })
        editor.current.registerCallback('selectImage', function (data, done) {
            mediaDone.current = done
            setIsMediaLibraryOpen(true)
        })




        editor.current.addEventListener('design:updated', (updates) => {
            editor.current.exportHtml((data) => {
                console.log(data)
                onSaved && onSaved(data)
            })
        })
        editor.current.loadDesign(initialDesign)
    }

    const onReady = () => {
        // editor is ready
        console.log('onReady')
    }

    return (
        <div className="mx-6 my-6 rounded-lg bg-white">
            <div className='w-full flex justify-end py-2 px-2'>
                {/* <button className='btn btn-primary btn-sm mr-4' onClick={onSaveClicked}>Save</button> */}
                <button className='btn btn-ghost btn-sm' onClick={onClose}>Close</button>
            </div>
            <EmailEditor
                ref={editor}
                editorId={'dfsfsdfoin'}
                onLoad={onLoad}
                className={''}
                onReady={onReady}
                minHeight={700}
                displayMode={'email'}
                safeHtml={true}
                tools={{}}
                options={{}}
                appearance={{
                    theme: 'light',
                    panels: {
                        tools: {
                            dock: 'left'
                        }
                    }
                }}
            />
            <Modal
                open={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                className='absolute top-10 left-10 bottom-10 right-10 overflow-scroll h-full block mx-10 my-10 rounded-xl'
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <QuickMediaLibrary
                    close={() => setIsMediaLibraryOpen(false)}
                    onSelect={(item) => {
                        if (item && item.get('file')) {
                            mediaDone.current && mediaDone.current({ url: item.get('file').url() })
                        }

                        setIsMediaLibraryOpen(false)
                    }} />
            </Modal>
        </div>
    )


    // return <Component
    //     value={values[id]}
    //     onContentChange={(value) => {
    //         console.log(value)
    //         // setFieldValue(id, value)
    //         // setFieldTouched(id, true, false)
    //     }}
    //     {...itemProps}
    // />
}