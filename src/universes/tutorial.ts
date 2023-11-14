const global_text = `// MMP""MM""YMM                                 
// P'   MM   '7                                 
//      MM  ,pW"Wq.'7MMpdMAo.  ,pW"Wq.  ,pP"Ybd 
//      MM 6W'   'Wb MM   'Wb 6W'   'Wb 8I   '" 
//      MM 8M     M8 MM    M8 8M     M8 'YMMMa. 
//      MM YA.   ,A9 MM   ,AP YA.   ,A9 L.   I8 
//    .JMML.'Ybmd9'  MMbmmd'   'Ybmd9'  M9mmmP' 
//                   MM                         
//                 .JMML.                        
//
// Web-based Live Coding Environment made by Bubo

// If you landed here, you are probably looking for help. This universe is a tutorial that will help you
// to get started with Topos and its interface. Take a look around:
// 
// - Left bar: Access to all the available text files with explanations
// - Upper bar: Controls and information. Don't miss the Docs button!

// This file is the global file. It is evaluated 48 times per beat, unlike every other file that is only
// evaluated on demand. It is meant to be used as the central stage for your performance. You can use it
// to sequence your parts, control the global state of your performance, and define global variables.
// The global file can also be used as a scratchpad to test things out before committing them to a local
// file for later use. You can come back here by pressing Ctrl+G or clicking on the icon.
`;

const local_buffer = `// ,,  
// '7MMF'                                  '7MM  
//   MM                                      MM  
//   MM         ,pW"Wq.   ,p6"bo   ,6"Yb.    MM  
//   MM        6W'   'Wb 6M'  OO  8)   MM    MM  
//   MM      , 8M     M8 8M        ,pm9MM    MM  
//   MM     ,M YA.   ,A9 YM.    , 8M   MM    MM  
// .JMMmmmmMMM  'Ybmd9'   YMbmd'  'Moo9^Yo..JMML.

// Local files are meant to be used as a storage for scripts that you want to use in your performance.
// You can use them to store functions, variables, parts, or even entire songs. There are 9 local files
// available for you to use per universe. You can access them by clicking around or using the keyboard
// shortcuts (F1-F9). These files are tied to the universe, and you can't access them from other universes.
// Local files can be called from any other file without limitations. They can hold local variables but 
// sharing information with other scripts is done through global variables:

script(2) // calling script 2
s(2) // same but shorter
v('my_global_variable', 31360)

// Local files are saved only when code is evaluated. If you want to save your code, you need to eval!

`;

const init_buffer = `// ,,         
// '7MMF'              db   mm    
//   MM                     MM    
//   MM  '7MMpMMMb.  '7MM mmMMmm  
//   MM    MM    MM    MM   MM    
//   MM    MM    MM    MM   MM    
//   MM    MM    MM    MM   MM    
// .JMML..JMML  JMML..JMML. 'Mbmo 

// The init file is a special file that is executed when the universe is loaded. It is meant to be used
// as a setup file, where you can define global variables, functions, and other things that you want to
// be available from the start. It is only executed once, so if you want to change something, you need to
// reload the universe or force the reloading: Ctrl+Shift+Enter.

tempo(140) // set the bpm to 140
`;

const note_buffer = `# Notes

This is a scratchpad where you can write notes about your performance. It is saved on evaluation like 
every other file, so you can use it to keep track of your ideas or share information with other people.
The note file is using Markdown, so you can use it to write formatted text, lists, and even code. This
file is not very useful per se but you'll learn to like it when you will receive indecipherable Topos
compositions from your friends via an URL :)
`;

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
};
