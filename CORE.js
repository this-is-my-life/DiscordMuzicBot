const discord = require('discord.js')
const ytdl = require('ytdl-core')
const ytch = require('youtube-search')
const randomHexColor = require('random-hex-color')

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
        msgP0.member.voiceChannel.join().then((connection) => {
          ytch(msgP4, {
            maxResults: 1,
            key: ytToken
          }, (err, results) => {
            if (err) {
              console.log(err)
            } else {
              let sended
              connection.playStream(ytdl(results[0].link, { audioonly: true }), { volume: 0.5 })
                .on('start', () => {
                  sended = msgP0.channel.send(new discord.RichEmbed().setAuthor(msgP0.author.username + '에 의해 뮤봇이 부릅니다,', msgP0.author.displayAvatarURL).setColor(randomHexColor).setTitle(results[0].title).setDescription(results[0].description).setThumbnail(results[0].thumbnails))
                })
                .on('end', () => {
                  sended.edit('다불렀다뮤~')
                  connection.channel.leave()
                })
            }
          })
        })
      }
    }
  }
})
