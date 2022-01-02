import React from 'react'

export default (props) => {
    const {
        html
    } = props


    return (
        <div>
            <div className="border-2 border-warmGray-700 mt-4"
                dangerouslySetInnerHTML={{ __html: html }}>
            </div>
        </div>
    )
}