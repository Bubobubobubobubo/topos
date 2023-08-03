const global_text =`
// Global buffer: a central buffer to command them all.
// ====================================================
// The global buffer is a special buffer used to control
// the general behavior of your universe. It is meant to
// be used as a "control room" for your universe. You can
// make use of several commands to control the execution
// flow of all the files:
// - script(universe/universes: number): run script(s)
`

const local_buffer =`
// Local buffer: nine buffers to write your algorithms.
`

const init_buffer=`
// Init buffer: a buffer to initialize the universe.
// This universe is runned once when the universe is
// loaded!
`

const note_buffer='// Notes buffer: a buffer to write your notes.'

export const tutorial_universe = {
    global: { candidate: global_text, committed: global_text, evaluations: 0 },
    locals: {
        1: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        2: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        3: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        4: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        5: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        6: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        7: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        8: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
        9: { candidate: local_buffer, committed: local_buffer, evaluations: 0 },
    },
    init: { candidate: init_buffer, committed: init_buffer, evaluations: 0 },
    notes: { candidate: note_buffer },
}