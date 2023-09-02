export const examples = [
`
// Structure et approximation - Bubobubobubo
mod(.25) :: sound('zzfx').zzfx(
  // Randomized chaos :)
  [
    rand(1,5),,rand(500,1000),rand(.01, 0.02),,
    rand(.01, .05),irand(1,12),rand(0,8),,
    irand(0,200),-411,rand(0, 1),,,irand(-20, 40),,
    .43,irand(1,20)
  ]).room(0.4).size(0.15).cutoff(500 + usine() * 8000)
  .vel(0.1).gain(toss() ? .5 : .125)
  .delay(toss() ? 0.5 : 0).delayt(0.045).delayfb(0.1).out()
rhythm(.5, toss() ? 5 : 7, 12) :: sound('kick').n(13).out()
rhythm(toss() ? .25 : .5, div(2) ? 3 : 5, 12) :: sound(
  toss() ? 'snare' : 'cp').n(5).out()
rhythm(div(2) ? .5 : .25, div(4) ? 8 : 11, 12) :: sound('hat')
  .orbit(3).room(0.5).size(0.5).n(0).out()
`,
`
// Part-Dieu - Bubobubobubo
mod(rarely(12) ? .5 : .25) :: sound('ST22')
  .note([30, 30, 30, 31].repeatAll(8).div(.5))
  .cut(1).n([19, 21].div(.75))
  .cutoff(irand(200, 5000))
  .resonance(rand(0.2,0.8))
  .room(0.9).size(1).orbit(2)
  .speed(0.25).vel(0.3).end(0.5)
  .out()
mod(.5) :: snd('dr')
  .n([0, 0, 0, 0, 2, 8].beat())
  .gain(1).out()
mod(div(2) ? 1 : 0.75) :: snd('bd').n(2).out()
mod(4) :: snd('snare').n(5)
  .delay(0.5).delayt(bpm() / 60 / 8)
  .delayfb(0.25).out()
`,
`
// Atarism - Bubobubobubo
bpm(85);
let modifier = [.5, 1, 2].div(8);
let othermod = [1, .5, 4].div(4);
mod(modifier / 2):: sound('STA9').n([0,2].div(.5)).speed(0.5).vel(0.5).out()
mod(.5)::sound('STA9').n([0, 20].div(.5)).speed([1,1.5].repeatAll(4).beat() / 4)
  .cutoff(500 + usine(.25) * 3000).vel(0.5).out()
mod(modifier / 2):: sound('STA9')
  .n([0,7].div(.5)).speed(div(othermod) ? 2 :4).vel(0.45).out()
rhythm(.25, 3, 8, 1) :: sound('STA9')
  .note([30, 33].pick()).n(32).speed(0.5).out()
rhythm(othermod, 5, 8) :: sound('dr').n([0,1,2].beat()).out()
mod(1) :: sound('kick').vel(1).out()
`,
`
// Ancient rhythms - Bubobubobubo
mod(1)::snd('kick').out();
mod(2)::snd('sd').room(0.9).size(0.9).out();
mod(0.25)::snd('hh').out();
mod(2)::snd('square')
  .cutoff(500).note(50-12).resonance(20).sustain(0.2).out()
mod(1/4)::snd(divseq(1, 'sawtooth', 'triangle', 'pulse'))
  .note(divseq(4, 50, 53, 55, 50, 50, 52, 58, 50+12, 50+15) + divseq(0.5, 0, 12, 24))
  .cutoff(usine(.5)*10000).resonance(divseq(2, 10,20))
  .fmi($(1) % 10).fmh($(2) % 5)
  .room(0.8).size(0.9)
  .delay(0.5).delaytime(0.25)
  .delayfb(0.6)
  .sustain(0.01 + usine(.25) / 10).out()
mod(4)::snd('amencutup').n($(19)).cut(1).orbit(2).pan(rand(0.0,1.0)).out()
log(bar(), beat(), pulse())`,
`
// Crazy arpeggios - Bubobubobubo
bpm(110)
mod(0.125) && sound('sawtooth')
  .note([60, 62, 63, 67, 70].div(.125) + 
        [-12,0,12].beat() + [0, 0, 5, 7].bar())
  .sustain(0.1).fmi(0.25).fmh(2).room(0.9)
  .gain(0.75).cutoff(500 + usine(8) * [500, 1000, 2000].bar())
  .delay(0.5).delayt(0.25).delayfb(0.25)
  .out();
mod(1) && snd('kick').out();
mod(2) && snd('snare').out();
mod(.5) && snd('hat').out();
`, `
// Obscure Shenanigans - Bubobubobubo
mod([1/4,1/8,1/16].div(8)):: sound('sine')
	.freq([100,50].div(16) + 50 * ($(1)%10))
	.gain(0.5).room(0.9).size(0.9)
	.sustain(0.1).out()
mod(1) :: sound('kick').out()
mod(2) :: sound('dr').n(5).out()
div(3) :: mod([.25,.5].div(.5)) :: sound('dr')
  .n([8,9].pick()).gain([.8,.5,.25,.1,.0].div(.25)).out()
`, `
// Resonance bliss - Bubobubobubo
mod(.25)::snd('arpy')
  .note(30 + [0,3,7,10].beat())
  .cutoff(usine(.5) * 5000).resonance(10).gain(0.3)
  .end(0.8).room(0.9).size(0.9).n(0).out();
mod([.25,.125].div(2))::snd('arpy')
  .note(30 + [0,3,7,10].beat())
  .cutoff(usine(.5) * 5000).resonance(20).gain(0.3)
  .end(0.8).room(0.9).size(0.9).n(3).out();
mod(.5) :: snd('arpy').note(
  [30, 33, 35].repeatAll(4).div(1) - [12,0].div(0.5)).out()
`
]
