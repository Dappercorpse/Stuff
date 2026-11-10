import { readdir, writeFile, readFile } from 'fs/promises'
import { watch } from 'fs'
import path from 'path'
import { parseFile } from 'music-metadata'
import express from 'express'

let musicFolder = 'public/music'
let songsFile = 'src/data/songs.json'
let idsFile = 'src/data/ids.json'
let junkPhrases = ['SongsLover.com', 'HipHopKit.com']

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60)
    let rest = Math.floor(seconds % 60)
    return minutes + ':' + (rest < 10 ? '0' + rest : rest)
}

function cleanTitle(title) {
    let cleaned = title
    for (let junk of junkPhrases) {
        cleaned = cleaned.split(junk).join('')
    }
    return cleaned.replace(/\s*[-|]\s*$/, '').trim()
}

async function loadIds() {
    try {
        return JSON.parse(await readFile(idsFile, 'utf8'))
    } catch (error) {
        return {}
    }
}

async function buildLibrary() {
    let ids = await loadIds()
    let nextId = Math.max(0, ...Object.values(ids)) + 1
    let files = (await readdir(musicFolder)).filter((name) => name.toLowerCase().endsWith('.mp3'))
    let songs = []

    for (let name of files) {
        try {
            let meta = await parseFile(path.join(musicFolder, name))

            if (ids[name] === undefined) {
                ids[name] = nextId
                nextId++
                console.log('New id for ' + name + ': ' + ids[name])
            }

            songs.push({
                id: ids[name],
                title: cleanTitle(meta.common.title || path.parse(name).name),
                artist: meta.common.artist || 'Unknown',
                album: meta.common.album || 'Unknown',
                date: meta.common.year ? String(meta.common.year) : '',
                duration: formatTime(meta.format.duration),
                src: '/music/' + name,
            })
        } catch (error) {
            console.log('Skipped ' + name + ' (still copying or unreadable)')
        }
    }

    await writeFile(idsFile, JSON.stringify(ids, null, 2))
    await writeFile(songsFile, JSON.stringify(songs, null, 2))
    console.log('Library updated: ' + songs.length + ' songs')
}

let timer = null

function scheduleBuild() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        buildLibrary().catch((error) => console.log('Scan failed: ' + error.message))
    }, 1000)
}

await buildLibrary()

watch(musicFolder, scheduleBuild)
console.log('Watching ' + musicFolder + ' for changes...')