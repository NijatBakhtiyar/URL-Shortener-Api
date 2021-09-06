import React, { useState } from 'react'
import ReactDom from 'react-dom'
import { TextField, Button, LinearProgress } from '@material-ui/core'
import shrtcode from '../api/shrtcode'
import {CopyToClipboard} from 'react-copy-to-clipboard'

const HTTP_URL_VALIDATION_REGEX = /[(http(s) ?): \/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    
const Search = () => {
    const [link, setLink] = useState('')
    const [short, setShort] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const validateURL = (string) => {
        return string.match(HTTP_URL_VALIDATION_REGEX)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateURL(link)) {
            getLink();
            setLink('');
            setIsLoading(!isLoading);
        }
        else {
            setShort(<span style={{color:'red'}}>Please input a Valid URL</span>)
        }
    };

    const getLink = async () => {
        await shrtcode
            .get(`shorten?url=${link}`)
            .then((response) => {
                setShort(response.data.result.short_link);
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (
        <>
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={handleSubmit}>
                <TextField
                    style={{ marginBottom: '20px' }}
                    label='Input Your Link'
                    variant='outlined'
                    value={link}
                    onChange={(e) =>setLink(e.target.value)}
                />
                {!isLoading &&
                <Button variant='contained' color='primary' onClick={handleSubmit}
                    style={{marginBottom: '20px'}}
                >
                    Submit
                </Button>
                }
                {isLoading && <LinearProgress/>}
            </form>
            {short && 
                <div style={{display:'flex', justifyContent:'center', flexDirection:'column'}}>
                <p>Short Link: <a href={short}>{short}</a></p>
                <CopyToClipboard text={short}>
                    <Button variant='outlined' color='secondary'>Copy</Button>
                </CopyToClipboard>
                </div>
            }
        </>
    )
}

export default Search