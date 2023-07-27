import './style.css'
import { EditorView } from "codemirror";
import { editorSetup } from './EditorSetup';
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { Clock } from './Clock'
import { vim } from "@replit/codemirror-vim";
import { AppSettings } from './AppSettings';
import { ViewUpdate } from '@codemirror/view';
import { 
  highlightSelection, 
  unhighlightSelection, 
  rangeHighlighting 
} from "./highlightSelection";
import { UserAPI } from './API';
import { Extension } from '@codemirror/state';
import { Universes, File, template_universe } from './AppSettings';
import { tryEvaluate } from './Evaluator';



export class Editor { 

  // Data structures for editor text management
  universes: Universes
  selected_universe: string
  local_index: number = 1
  editor_mode: 'global' | 'local' | 'init' = 'local'

  settings = new AppSettings()
  editorExtensions: Extension[] = []
  userPlugins: Extension[]  = []
  state: EditorState
  api: UserAPI

  // Audio stuff
  audioContext: AudioContext
  view: EditorView
  clock: Clock

  // Transport elements
  play_button: HTMLButtonElement = document.getElementById('play-button') as HTMLButtonElement
  pause_button: HTMLButtonElement = document.getElementById('pause-button') as HTMLButtonElement
  clear_button: HTMLButtonElement = document.getElementById('clear-button') as HTMLButtonElement

  // Script selection elements
  local_button: HTMLButtonElement = document.getElementById('local-button') as HTMLButtonElement
  global_button: HTMLButtonElement = document.getElementById('global-button') as HTMLButtonElement
  init_button: HTMLButtonElement = document.getElementById('init-button') as HTMLButtonElement
  universe_viewer: HTMLDivElement = document.getElementById('universe-viewer') as HTMLDivElement

  // Buffer modal
  buffer_modal: HTMLDivElement = document.getElementById('modal-buffers') as HTMLDivElement
  buffer_search: HTMLInputElement = document.getElementById('buffer-search') as HTMLInputElement
  settings_modal: HTMLDivElement = document.getElementById('modal-settings') as HTMLDivElement

  // Local script tabs
  local_script_tabs: HTMLDivElement = document.getElementById('local-script-tabs') as HTMLDivElement

  constructor() {



    // ================================================================================ 
    // Loading the universe from local storage
    // ================================================================================

    this.selected_universe = "Default";
    this.universe_viewer.innerHTML = `Topos: ${this.selected_universe}`
    this.universes = this.settings.universes

    // ================================================================================
    // Audio context and clock
    // ================================================================================

    this.audioContext = new AudioContext({ sampleRate: 44100, latencyHint: 0.000001});
    this.clock = new Clock(this, this.audioContext);

    // ================================================================================
    // User API
    // ================================================================================

    this.api = new UserAPI(this);

    // ================================================================================
    // CodeMirror Management
    // ================================================================================

    this.editorExtensions = [
      editorSetup, 
      rangeHighlighting(), 
      javascript(),
      EditorView.updateListener.of((v:ViewUpdate) => {
        // This is the event listener for the editor
      }),
      ...this.userPlugins
    ]

    let dynamicPlugins = new Compartment;
    this.state = EditorState.create({
      extensions: [
        ...this.editorExtensions,
        EditorView.lineWrapping,
        dynamicPlugins.of(this.userPlugins)
      ],
      doc: this.universes[this.selected_universe].locals[this.local_index].candidate
    })

    this.view = new EditorView({
      parent: document.getElementById('editor') as HTMLElement,
      state: this.state
    });

    // ================================================================================
    // Application event listeners
    // ================================================================================

    document.addEventListener('keydown', (event: KeyboardEvent) => {

		  // TAB should do nothing
		  if (event.key === 'Tab') {
        event.preventDefault();
		  }

      // Ctrl + Shift + V: Vim Mode
      if ((event.key === 'v' || event.key === 'V') && event.ctrlKey && event.shiftKey) {
        this.settings.vimMode = !this.settings.vimMode
        event.preventDefault();
        this.userPlugins = this.settings.vimMode ? [] : [vim()]
        this.view.dispatch({
          effects: dynamicPlugins.reconfigure(this.userPlugins)
        })
      }

      // Ctrl + Enter or Return: Evaluate the hovered code block
		  if ((event.key === 'Enter' || event.key === 'Return') && event.ctrlKey) {
        event.preventDefault();
		  	const code = this.getCodeBlock();
        this.currentFile.candidate = this.view.state.doc.toString() 
        tryEvaluate(this, this.currentFile)
		  }

		  // Shift + Enter or Ctrl + E: evaluate the line
		  if ((event.key === 'Enter' && event.shiftKey) || (event.key === 'e' && event.ctrlKey)) {
		  	event.preventDefault(); // Prevents the addition of a new line
        this.currentFile.candidate = this.view.state.doc.toString() 
		  	const code = this.getSelectedLines();
		  }

      // This is the modal to switch between universes
      if (event.metaKey && event.key === "b") {
        this.openBuffersModal()
      }

      // This is the modal that opens up the settings
      if (event.shiftKey && event.key === "Escape") {
        this.openSettingsModal()
      }


    }); 

    // ================================================================================
    // Interface buttons
    // ================================================================================

    let tabs = document.querySelectorAll('[id^="tab-"]');
    // Iterate over the tabs with an index
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', (event) => {

        // Updating the CSS accordingly
        tabs[i].classList.add('bg-orange-300')
        for (let j = 0; j < tabs.length; j++) {
          if (j != i) tabs[j].classList.remove('bg-orange-300')
        }
        this.currentFile.candidate = this.view.state.doc.toString() 

        let tab = event.target as HTMLElement
        let tab_id = tab.id.split('-')[1]
        this.local_index = parseInt(tab_id)
        this.updateEditorView()
      })
    }

    this.play_button.addEventListener('click', () => {
      this.play_button.children[0].classList.add('fill-orange-300')
      this.pause_button.children[0].classList.remove('fill-orange-300')
      this.clock.start()
    })

    this.clear_button.addEventListener('click', () => {
      // Reset the current universe to a template
      if (confirm('Do you want to reset the current universe?')) {
        this.universes[this.selected_universe] = template_universe
        this.updateEditorView()
      }
    });

    this.pause_button.addEventListener('click', () => {
      // Change the color of the button
      this.play_button.children[0].classList.remove('fill-orange-300')
      this.pause_button.children[0].classList.add('fill-orange-300')
      this.clock.pause()
    })

    this.local_button.addEventListener('click', () => this.changeModeFromInterface('local'))
    this.global_button.addEventListener('click', () => this.changeModeFromInterface('global'))
    this.init_button.addEventListener('click', () => this.changeModeFromInterface('init'))

    this.buffer_search.addEventListener('keydown', (event) => {
      if (event.key === "Enter") {
        let query = this.buffer_search.value
        if (query.length > 2 && query.length < 20) {
          this.loadUniverse(query)
          this.buffer_search.value = ""
          this.closeBuffersModal()
        }
      }
    })
  }

  get global_buffer() {
    return this.universes[this.selected_universe.toString()].global
  }

  get init_buffer() {
    return this.universes[this.selected_universe.toString()].init
  }

  changeModeFromInterface(mode: 'global' | 'local' | 'init') {

    const interface_buttons = [this.local_button, this.global_button, this.init_button]

    let changeColor = (button: HTMLElement) => {
      interface_buttons.forEach(button => {
        // Get the child svg element of each button
        let svg = button.children[0] as HTMLElement
        if (svg.classList.contains('text-orange-300')) {
          svg.classList.remove('text-orange-300')
          svg.classList.add('text-white')
        }
      })
      button.children[0].classList.add('text-orange-300')
    }

    if (mode === this.editor_mode) return
    switch (mode) {
      case 'local': 
        if (this.local_script_tabs.classList.contains('hidden')) {
          this.local_script_tabs.classList.remove('hidden')
        }
        this.currentFile.candidate = this.view.state.doc.toString() 
        changeColor(this.local_button)
        this.editor_mode = 'local';
        break;
      case 'global': 
        if (!this.local_script_tabs.classList.contains('hidden')) {
          this.local_script_tabs.classList.add('hidden')
        }
        this.currentFile.candidate = this.view.state.doc.toString() 
        changeColor(this.global_button)
        this.editor_mode = 'global';
        break;
      case 'init':
        if (!this.local_script_tabs.classList.contains('hidden')) {
          this.local_script_tabs.classList.add('hidden')
        }
        this.currentFile.candidate = this.view.state.doc.toString() 
        changeColor(this.init_button)
        this.editor_mode = 'init';
        break;
    }
    this.updateEditorView();
  }

  updateEditorView():void {
    // Remove everything from the editor
    this.view.dispatch({
      changes: {
        from: 0, 
        to: this.view.state.doc.toString().length, 
        insert:''
      }
    })

    // Insert something
    this.view.dispatch({
      changes: {
        from: 0,
        insert: this.currentFile.candidate
      }
    });
  }

  get currentFile(): File {
    switch (this.editor_mode) {
      case 'global': return this.global_buffer;
      case 'local': return this.universes[this.selected_universe].locals[this.local_index];
      case 'init': return this.init_buffer;
    }
  }

  loadUniverse(universeName: string) {
    this.currentFile.candidate = this.view.state.doc.toString()
    let editor = this;
    
    function whichBuffer(editor: Editor): File {
      switch (editor.editor_mode) {
        case 'global': return editor.global_buffer
        case 'local': return editor.universes[
          editor.selected_universe].locals[editor.local_index]
        case 'init': return editor.init_buffer
      }
    }

    let selectedUniverse = universeName.trim()
    if (this.universes[selectedUniverse] === undefined) {
      this.universes[selectedUniverse] = template_universe
    }
    this.selected_universe = selectedUniverse
    this.universe_viewer.innerHTML = `Topos: ${selectedUniverse}`
    this.global_buffer = this.universes[this.selected_universe.toString()].global
    this.init_buffer = this.universes[this.selected_universe.toString()].init
    // We should also update the editor accordingly
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.toString().length, insert:'' }
    })
    this.view.dispatch({
      changes: { from: 0, insert: this.currentFile.candidate }
    });
  }

  getCodeBlock(): string {
    // Capture the position of the cursor
    let cursor = this.view.state.selection.main.head
		const state = this.view.state;
		const { head } = state.selection.main;
		const currentLine = state.doc.lineAt(head);
		let startLine = currentLine;
		while (startLine.number > 1 && !/^\s*$/.test(state.doc.line(startLine.number - 1).text)) {
			startLine = state.doc.line(startLine.number - 1);
		}
		let endLine = currentLine;
		while (
      endLine.number < state.doc.lines && !/^\s*$/.test(state.doc.line(endLine.number + 1).text)) { 
        endLine = state.doc.line(endLine.number + 1);
      }

      this.view.dispatch({selection: {anchor: 0 + startLine.from, head: endLine.to}});
      highlightSelection(this.view);

		  setTimeout(() => {
        unhighlightSelection(this.view)
        this.view.dispatch({selection: {anchor: cursor, head: cursor}});
       }, 200);

       let result_string = state.doc.sliceString(startLine.from, endLine.to);
       result_string = result_string.split('\n').map((line, index, lines) => {
         const trimmedLine = line.trim();
         if (index === lines.length - 1 || /^\s/.test(lines[index + 1]) || trimmedLine.startsWith('@')) {
           return line;
         } else {
           return line + ';\\';
         }
       }).join('\n');
       return result_string
  }

  getSelectedLines = (): string => {
    const state = this.view.state;
    const { from, to } = state.selection.main;
    const fromLine = state.doc.lineAt(from);
    const toLine = state.doc.lineAt(to);
    this.view.dispatch({selection: {anchor: 0 + fromLine.from, head: toLine.to}});
    // Release the selection and get the cursor back to its original position

  	// Blink the text!
    highlightSelection(this.view);

		setTimeout(() => {
      unhighlightSelection(this.view)
      this.view.dispatch({selection: {anchor: from, head: from}});
		}, 200);
 		return state.doc.sliceString(fromLine.from, toLine.to);   
  }

  openSettingsModal() {
    // If the modal is hidden, unhide it and hide the editor
    if (document.getElementById('modal-settings')!.classList.contains('invisible')) {
      document.getElementById('editor')!.classList.add('invisible')
      document.getElementById('modal-settings')!.classList.remove('invisible')
    } else {
      this.closeSettingsModal();
    }
  }

  closeSettingsModal() {
    document.getElementById('editor')!.classList.remove('invisible')
    document.getElementById('modal-settings')!.classList.add('invisible')
  }

  openBuffersModal() {
    // If the modal is hidden, unhide it and hide the editor
    if (document.getElementById('modal-buffers')!.classList.contains('invisible')) {
      document.getElementById('editor')!.classList.add('invisible')
      document.getElementById('modal-buffers')!.classList.remove('invisible')
      document.getElementById('buffer-search')!.focus()
    } else {
      this.closeBuffersModal();
    }
  }

  closeBuffersModal() {
    // @ts-ignore
    document.getElementById('buffer-search')!.value = ''
    document.getElementById('editor')!.classList.remove('invisible')
    document.getElementById('modal-buffers')!.classList.add('invisible')
    document.getElementById('modal')!.classList.add('invisible')
  }
}

const app = new Editor()

function startClock() {
  document.getElementById('editor')!.classList.remove('invisible')
  document.getElementById('modal')!.classList.add('hidden')
  document.getElementById('start-button')!.removeEventListener('click', startClock);
  document.removeEventListener('keydown', startOnEnter)
  app.clock.start()
  app.view.focus()
  // Change the play button svg color to orange
  document.getElementById('pause-button')!.children[0].classList.remove('fill-orange-300')
  document.getElementById('play-button')!.children[0].classList.add('fill-orange-300')
}

function startOnEnter(e: KeyboardEvent) {
  if (e.code === 'Enter' || e.code === "Space") startClock()
}

document.addEventListener('keydown', startOnEnter)
document.getElementById('start-button')!.addEventListener(
  'click', startClock);

// When the user leaves the page, all the universes should be saved in the localStorage
window.addEventListener('beforeunload', () => {
  // Iterate over all local files and set the candidate to the committed
  app.currentFile.candidate = app.view.state.doc.toString() 
  app.currentFile.committed = app.view.state.doc.toString()
  app.settings.saveApplicationToLocalStorage(app.universes)
  return null;
});