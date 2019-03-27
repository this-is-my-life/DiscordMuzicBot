const discord = require('discord.js')
const ytdl = require('ytdl-core')
const ytch = require('youtube-search')
const randomHexColor = require('random-hex-color')

const mu = new discord.Client()
mu.login(process.env.muto)
const ytToken = process.env.muyt

let song = {}

mu.on('message', (msg) => {
  let search = msg.content.slice(process.env.mupf.length)
  if ((search === '그만불러' || search === '닥쳐') && msg.content.startsWith(process.env.mupf) && song[msg.channel.id]) {
    song.end()
    msg.channel.send('쳇... ')
  } else if (search && msg.content.startsWith(process.env.mupf) && !song[msg.channel.id]) {
    if (msg.member.voiceChannel) {
      if (!msg.guild.voiceConnection) {
        msg.member.voiceChannel.join()
      }
      msg.channel.send('검색중... ' + search).then((th) => {
        ytch(search, {
          maxResults: 1,
          key: ytToken,
          type: 'video'
        }, (err, results) => {
          if (err) {
            th.edit('에러발생!\n' + err)
          } else {
            let songEmb = new discord.RichEmbed()
              .setAuthor(msg.author.username + '님이 뮤봇의 노래를 듣고있습니다', msg.author.displayAvatarURL)
              .setTitle(results[0].title)
              .setDescription(results[0].description)
              .setThumbnail(results[0].thumbnails.default.url)
              .setColor(randomHexColor())
              .setFooter('유튜브 서비스 상태의 따라 재생속도가 느리거나 음질이 좋지 않을 수 있습니다')
            th.edit(songEmb)

            song[msg.channel.id] = msg.guild.voiceConnection.playStream(ytdl(results[0].link, { audioonly: true }), { volume: 0.5 })

            song[msg.channel.id].on('end', () => {
              let songEndEmb = new discord.RichEmbed()
                .setAuthor(msg.author.username + '님이 뮤봇의 노래를 듣고있*었*습니다', msg.author.displayAvatarURL)
                .setTitle(results[0].title)
                .setDescription(results[0].description)
                .setThumbnail(results[0].thumbnails.default.url)
                .setColor('#ff0000')
                .setFooter('유튜브 서비스 상태의 따라 재생속도가 느리거나 음질이 좋지 않을 수 있*었*습니다')
              song[msg.channel.id] = null
              msg.member.voiceChannel.leave()
              th.edit(songEndEmb)
            })
          }
        })
      })
    }
  } else if (msg.content.startsWith(process.env.mupf) && song[msg.channel.id]) {
    msg.channel.send('이미 재생중인 노래가 있다뮤! `mz!그만불러`를 사용하라뮤!')
  }
})
