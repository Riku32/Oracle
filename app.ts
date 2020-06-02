const axios = require('axios') //you can use any http client
const Discord = require('discord.js')
const FileType = require('file-type')
const got = require('got')
const fetch = require('node-fetch')
const request = require('request').defaults({ encoding: null })
import { Detector } from './utils/detect'
import * as fs from 'fs'
import { Log } from './utils/log'
import { File } from './utils/file'

const client = new Discord.Client()
require('dotenv').config()

let logchannel
let detector

client.on('ready', () => {
    Log.info(`Logged in as ${client.user.tag}`)
    detector = new Detector("file://./model/")
    detector.init()

    logchannel = client.channels.cache.get(process.env.logchannel)
})

client.on('message', msg => {
    msg.attachments.forEach(function(attachment) {
        if (msg.author.bot || !detector.ready) return

        scan(attachment.url, msg)
    })
})

async function scan(link: string, msg: any) {
    const pic = await axios.get(link, {
        responseType: 'arraybuffer',
    })

    const stream = got.stream(link)

    const FileData = await FileType.fromStream(stream)
    if (!FileData) return

    const mime = JSON.parse(JSON.stringify(FileData)).mime

    if (["image/png", "image/jpeg", "image/bmp"].includes(mime)) {
        const response = await detector.predict(pic)
        if (["Hentai", "Porn"].includes(response[0].className)) {
            const embed = new Discord.MessageEmbed()
                .setImage(await betterUpl(link))
                .setDescription(`**User:** <@${msg.author.id}> (${msg.author.id})\n**Channel: <#${msg.channel.id}>**\n**Classification:** ${response[0].className}`)
                .setColor(process.env.color)
                .setTimestamp()


            logchannel.send(embed)
            msg.delete()

            const userembed = new Discord.MessageEmbed()
                .setTitle('Content Violation!')
                .setThumbnail('https://i.kawaii.sh/6wrmWbH.png')
                .setDescription(`Algorithm has classified image as \`${response[0].className}\`, this will be reported to staff!\n\n**Offender**: <@${msg.author.id}>`)
                .setColor(process.env.color)
                .setTimestamp()

            msg.channel.send(userembed)
        }
    }
}

async function betterUpl(file: string) {
    return fetch(file)
        .then(r => r.buffer())
        .then(buffer => File.kawaiiUpload(buffer))
}

client.login(process.env.token)