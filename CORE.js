const discord = require('discord.js')
const ytdl = require('ytdl-core')
const ytch = require('youtube-search')

const mu = new discord.Client()
mu.login(process.env.muto)
const ytToken = process.env.muyt

mu.on('message', (msgP0) => {
  let msgP1 = msgP0.content.split(' ')
  let msgP2 = msgP1[0].slice(process.env.mupf.length)
  let msgP3 = msgP1.slice(1)
  let msgP4 = msgP3.join(' ')
  if (msgP2 === '불러줘') {
    if (msgP0.member.voiceChannel) {
      if (!msgP0.guild.voiceConnection) {
        msgP0.member.voiceChannel.join()
      }
      ytch(msgP4, {
        maxResults: 1,
        key: ytToken
      }, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          msgP0.guild.voiceConnection.playStream(ytdl(results[0].link, { audioonly: true }))
        }
      })
    }
  }
})
