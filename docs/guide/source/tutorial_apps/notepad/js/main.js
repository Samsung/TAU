/*global window, document, $, tau, JSON, console */
/*jslint plusplus: true*/

(function () {
    'use strict';

    var newBtn = document.getElementById('newBtn'),
        saveBtn = document.getElementById('saveBtn'),
        editorField = document.getElementById('editorField'),
        notesList = document.getElementById('notesList'),
        editorPage = document.getElementById('editor'),

        mainPageId = '#main',
        editorPageId = '#editor',

        currentIndex = null,

        EMPTY_CONTENT = '(empty)',
        STORAGE_KEY = 'notepad';

    /**
     * Get data from local storage
     * @return {Array}
     */
    function getStorage(key) {
        return JSON.parse(window.localStorage.getItem(key)) || false;
    }

    /**
     * Add data to local storage
     * @param {Array} data
     */
    function addStorage(data) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    /**
     * Return current page ID
     * @returns
     */
    function getCurrentPageId() {
        return $('[data-role="page"]:visible')[0].id;
    }

    /**
     * Refresh current page
     */
    function refreshCurrentPage() {
        $('#' + getCurrentPageId()).trigger('create');
    }

    /**
     * Get notes from storage
     * @return {Array}
     */
    function getNotes() {
        return getStorage(STORAGE_KEY) || [];
    }

    /**
     * Clear list with notes
     */
    function clearNotesList() {
        notesList.innerHTML = '';
    }

    /**
     * Delete note from storage
     */
    function deleteNote(index) {
        var notes = getNotes();

        if (notes[index] !== undefined) {
            notes.splice(index, 1);
            addStorage(notes);
        } else {
            console.error('deleteNote: note not found');
        }

        showNotes();
        refreshCurrentPage();
        event.stopPropagation();
    }

    /**
     * Edit note using array index
     * @param index
     */
    function editNote(index) {
        var notes = getNotes();

        if (notes[index] !== undefined) {
            currentIndex = index;
            editorField.value = getNotes()[index];
            tau.changePage(editorPageId);
        } else {
            console.error('editNote: note not found');
            showNotes();
            refreshCurrentPage();
        }
    }

    /**
     * Show all notes
     */
    function showNotes() {
        var notes = getNotes(),
            notesLen = notes.length,
            li = {},
            swipeCover = {},
            swipeItem = {},
            deleteBtn = {},
            i = 0,
            notesListInst;

        clearNotesList();

        for (i; i < notesLen; i += 1) {
            li = document.createElement('li');
            li.addEventListener('click', editNote.bind(this, i), false);

            deleteBtn = document.createElement('div');
            deleteBtn.setAttribute('data-role', 'button');
            deleteBtn.setAttribute('data-inline', 'true');
            deleteBtn.innerText = 'Delete';

            deleteBtn.addEventListener('click', deleteNote.bind(this, i), false);

            li.innerText = notes[i].replace(/\n/g, ' ') || EMPTY_CONTENT;
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
            notesListInst = tau.widget.getInstance(notesList);
            tau.widget.Button(deleteBtn);
            notesListInst.refresh();
        }
    }

    /**
     * Clear editor textarea
     */
    function clearEditor() {
        editorField.value = '';
    }

    /**
     * Save note to storage
     */
    function saveNote() {
        var notes = getNotes();

        if (currentIndex !== null) {
            notes[currentIndex] = editorField.value;
        } else {
            notes.push(editorField.value);
        }

        addStorage(notes);

        clearEditor();
        showNotes();
        tau.changePage(mainPageId);
    }

    /**
     * New note button handler
     */
    function newNote() {
        currentIndex = null;
        clearEditor();

        tau.changePage(editorPageId);
    }

    /**
     * On editor page show handler
     */
    function onEditorPageShow() {
        editorField.focus();
    }

    /**
     * Attach events
     */
    function events() {
        newBtn.addEventListener('click', newNote);
        saveBtn.addEventListener('click', saveNote);

        editorPage.addEventListener('pageshow', onEditorPageShow);

        $(window).on('tizenhwkey', function (e) {
            if (e.originalEvent.keyName === "back"
                    && window.tizen
                    && window.tizen.application) {
                switch (getCurrentPageId()) {
                case 'main':
                    window.tizen.application.getCurrentApplication().exit();
                    break;
                default:
                    window.history.back();
                    break;
                }
                return false;
            }
        });
    }

    /**
     * Initialize
     */
    function init() {
        showNotes();
        events();
    }

    init();
}());