import { useRef } from 'react';
import UploadIcon from '../assets/images/UploadIcon.png'
import {NavLink} from 'react-router-dom';

export function Header({queueNumber, onUpload}){
    let fileInput = useRef(null);

    function handleFile() {
      let files = Array.from(fileInput.current.files);
      if (files.length > 0) onUpload(files);
      fileInput.current.value = '';
    }

    return(
        <div className='header'>
            <div className='tabs'>
                <NavLink to='/' end className='headerItem js-header-item'>Library</NavLink>
                <NavLink to='/queue' className='headerItem js-header-item'>Queue({queueNumber})</NavLink>
            </div>
            <div className='functions'>
                    <button id='upload' className='headerItem js-header-item' onClick={() => fileInput.current.click()}>
                        <img src={UploadIcon} alt='Upload Icon' />
                        Upload
                    </button>
                    <input type='file' accept='.mp3,audio/mpeg' multiple ref={fileInput} onChange={handleFile} hidden />

                    <button className='headerItem' aria-label='Menu'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='white'>
                        <circle cx='12' cy='5' r='2' />
                        <circle cx='12' cy='12' r='2' />
                        <circle cx='12' cy='19' r='2' />
                    </svg>
                    </button>

                    <button className='headerItem' aria-label='Add music' title='Add music'>
                    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2' strokeLinecap='round'>
                        <line x1='12' y1='5' x2='12' y2='19' />
                        <line x1='5' y1='12' x2='19' y2='12' />
                    </svg>
                </button>

            </div>
    </div>
    )
}