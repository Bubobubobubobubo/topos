const global_text =`
`

const local_buffer =`
`

const init_buffer=`
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
