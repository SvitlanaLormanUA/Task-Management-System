import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Settings,
  User,
  Image,
  Type,
  FileText,
  Copy,
  Trash2,
  Users,
  Heart,
  Printer,
  Download,
  Maximize2,
  MoreHorizontal,
  List,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  Link,
  Code,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useApiClient } from '../api/useApiClient';
import Header from '@/components/Header';

const EditorToolbar = ({ onAction }) => {
  const toolbarItems = [
    { icon: Bold, action: 'bold', tooltip: 'Bold' },
    { icon: Italic, action: 'italic', tooltip: 'Italic' },
    { icon: Underline, action: 'underline', tooltip: 'Underline' },
    { icon: Link, action: 'link', tooltip: 'Insert Link' },
    { icon: Code, action: 'code', tooltip: 'Code Block' },
    { icon: List, action: 'list', tooltip: 'Bullet List' },
    { icon: AlignLeft, action: 'align', tooltip: 'Align Text' },
    { icon: Image, action: 'image', tooltip: 'Insert Image' },
    { icon: Type, action: 'heading', tooltip: 'Heading' },
    { icon: Copy, action: 'copy', tooltip: 'Copy' },
    { icon: Users, action: 'mention', tooltip: 'Mention User' },
    { icon: Heart, action: 'favorite', tooltip: 'Add to Favorites' },
    { icon: Printer, action: 'print', tooltip: 'Print' },
    { icon: Download, action: 'download', tooltip: 'Download' },
    { icon: Maximize2, action: 'fullscreen', tooltip: 'Fullscreen' },
  ];
  const handleToolbarAction = (action) => {
    switch (action) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'list':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'link': {
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
      }
      case 'copy':
        document.execCommand('copy');
        break;
      case 'print':
        window.print();
        break;
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      default:
        onAction(action);
    }
  };

  return (
    <div className='bg-blue-50 border-t border-gray-200 p-4'>
      <div className='flex items-center gap-2 flex-wrap'>
        {toolbarItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={() => handleToolbarAction(item.action)}
              className='p-2 rounded hover:bg-blue-200 transition-colors'
              title={item.tooltip}
            >
              <IconComponent className='w-4 h-4 text-gray-600' />
            </button>
          );
        })}
        <div className='ml-auto'>
          <button
            onClick={() => handleToolbarAction('more')}
            className='p-2 rounded hover:bg-blue-200 transition-colors'
            title='More options'
          >
            <MoreHorizontal className='w-4 h-4 text-gray-600' />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(1);
  const [editingContent, setEditingContent] = useState('');
  const [activeFolder, setActiveFolder] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState(new Set([1, 2, 3, 4, 5, 6]));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const apiClient = useApiClient();

  // Sample data for fallback when API is not available
  const sampleNotes = [
    {
      id: 1,
      title: 'Meeting Notes',
      content: 'Discussed project timeline and deliverables...',
      folderId: 1,
      dateCreated: '2024-01-15T10:00:00Z',
      dateUpdated: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      title: 'Shopping List',
      content: 'Milk, Bread, Eggs, Butter...',
      folderId: 2,
      dateCreated: '2024-01-14T09:00:00Z',
      dateUpdated: '2024-01-14T09:15:00Z',
    },
    {
      id: 3,
      title: 'JavaScript Concepts',
      content: 'Closures, Promises, Async/Await...',
      folderId: 3,
      dateCreated: '2024-01-13T14:00:00Z',
      dateUpdated: '2024-01-13T14:45:00Z',
    },
    {
      id: 4,
      title: 'Project Alpha',
      content: 'Initial requirements and scope definition...',
      folderId: 4,
      dateCreated: '2024-01-12T11:00:00Z',
      dateUpdated: '2024-01-12T11:30:00Z',
    },
    {
      id: 5,
      title: 'Book Recommendations',
      content: 'Clean Code, Design Patterns, Refactoring...',
      folderId: 5,
      dateCreated: '2024-01-11T16:00:00Z',
      dateUpdated: '2024-01-11T16:20:00Z',
    },
    {
      id: 6,
      title: 'App Ideas',
      content: 'Task manager with AI, Recipe organizer...',
      folderId: 6,
      dateCreated: '2024-01-10T13:00:00Z',
      dateUpdated: '2024-01-10T13:25:00Z',
    },
    {
      id: 7,
      title: 'Team Standup',
      content: 'Daily progress updates and blockers...',
      folderId: 1,
      dateCreated: '2024-01-16T09:00:00Z',
      dateUpdated: '2024-01-16T09:15:00Z',
    },
    {
      id: 8,
      title: 'Weekend Plans',
      content: 'Visit the museum, movie night, grocery shopping...',
      folderId: 2,
      dateCreated: '2024-01-15T18:00:00Z',
      dateUpdated: '2024-01-15T18:10:00Z',
    },
  ];

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(`http://127.0.0.1:5000/notes`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch notes`);
      }

      const fetchedNotes = await response.json();
      setNotes(fetchedNotes);
      setIsOnline(true);
    } catch (err) {
      console.warn('API not available, using sample data:', err.message);
      setNotes(sampleNotes);
      setIsOnline(false);
      setError(`API unavailable: ${err.message}. Using sample data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const getNoteFolder = (note) => {
    return note.folderId || note.folder_id || 1;
  };

  const sortNotesByFolder = (notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      const folderA = getNoteFolder(a);
      const folderB = getNoteFolder(b);

      if (folderA !== folderB) {
        return folderA - folderB;
      }

      const dateA = new Date(a.dateUpdated || a.date_updated || a.dateCreated || a.date_created);
      const dateB = new Date(b.dateUpdated || b.date_updated || b.dateCreated || b.date_created);
      return dateB - dateA;
    });
  };

  const getNotesForFolder = (folderId) => {
    const folderNotes = notes.filter((note) => getNoteFolder(note) === folderId);
    return sortNotesByFolder(folderNotes);
  };

  const folders = [
    { id: 0, name: 'All Notes', noteCount: notes.length, isSpecial: true },
    {
      id: 1,
      name: 'Work',
      noteCount: notes.filter((n) => getNoteFolder(n) === 1).length,
      color: '#3B82F6',
    },
    {
      id: 2,
      name: 'Personal',
      noteCount: notes.filter((n) => getNoteFolder(n) === 2).length,
      color: '#10B981',
    },
    {
      id: 3,
      name: 'Learning',
      noteCount: notes.filter((n) => getNoteFolder(n) === 3).length,
      color: '#8B5CF6',
    },
    {
      id: 4,
      name: 'Projects',
      noteCount: notes.filter((n) => getNoteFolder(n) === 4).length,
      color: '#F59E0B',
    },
    {
      id: 5,
      name: 'Backlog',
      noteCount: notes.filter((n) => getNoteFolder(n) === 5).length,
      color: '#6B7280',
    },
    {
      id: 6,
      name: 'Ideas',
      noteCount: notes.filter((n) => getNoteFolder(n) === 6).length,
      color: '#EC4899',
    },
  ];

  const sortedFolders = [...folders].sort((a, b) => {
    if (a.isSpecial && !b.isSpecial) return -1;
    if (!a.isSpecial && b.isSpecial) return 1;
    return a.id - b.id;
  });

  const filteredNotes =
    activeFolder === 0 ? sortNotesByFolder(notes) : getNotesForFolder(activeFolder);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) {
      setError('Note title is required');
      return;
    }
    if (!folders.find((f) => f.id === selectedFolderId && f.id !== 0)) {
      setError('Invalid folder selected');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newNoteData = {
        title: newNoteTitle,
        content: '',
        folderId: selectedFolderId,
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
      };

      if (isOnline) {
        const response = await apiClient.post(`http://127.0.0.1:5000/notes`, newNoteData);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to create note' }));
          throw new Error(errorData?.error || 'Failed to create note');
        }

        const createdNote = await response.json();
        setNotes((prev) => [...prev, createdNote]);
        setSelectedNote(createdNote);
        setEditingContent(createdNote.content || '');
      } else {
        // Fallback for offline mode
        const newNote = {
          ...newNoteData,
          id: Math.max(...notes.map((n) => n.id), 0) + 1,
        };
        setNotes((prev) => [...prev, newNote]);
        setSelectedNote(newNote);
        setEditingContent(newNote.content || '');
      }

      setIsCreating(false);
      setNewNoteTitle('');
      setActiveFolder(selectedFolderId);
    } catch (err) {
      setError(err.message);
      console.error('Error creating note:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setEditingContent(note.content || '');
  };

  const handleUpdateContent = async () => {
    if (!selectedNote || editingContent === selectedNote.content) {
      return;
    }

    try {
      setError(null);

      const updatedData = {
        title: selectedNote.title,
        content: editingContent,
        folderId: getNoteFolder(selectedNote),
        dateUpdated: new Date().toISOString(),
      };

      if (isOnline) {
        const response = await apiClient.put(
          `http://127.0.0.1:5000/notes/${selectedNote.id}`,
          updatedData,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to update note' }));
          throw new Error(errorData?.error || 'Failed to update note');
        }

        const updatedNote = await response.json();
        setNotes((prev) => prev.map((note) => (note.id === selectedNote.id ? updatedNote : note)));
        setSelectedNote(updatedNote);
      } else {
        // Fallback for offline mode
        const updatedNote = { ...selectedNote, ...updatedData };
        setNotes((prev) => prev.map((note) => (note.id === selectedNote.id ? updatedNote : note)));
        setSelectedNote(updatedNote);
      }

      setLastSaved(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error updating note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setLoading(true);
      setError(null);

      if (isOnline) {
        const response = await apiClient.delete(`http://127.0.0.1:5000/notes/${noteId}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to delete note' }));
          throw new Error(errorData?.error || 'Failed to delete note');
        }
      }

      // Update local state regardless of API success for better UX
      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setEditingContent('');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting note:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveNote = async (noteId, newFolderId) => {
    const validFolder = folders.find((folder) => folder.id === newFolderId && folder.id !== 0);
    if (!validFolder) {
      setError('Invalid folder selected.');
      return;
    }

    const noteToMove = notes.find((note) => note.id === noteId);
    if (!noteToMove) {
      setError('Note not found.');
      return;
    }

    try {
      setError(null);

      const updatedData = {
        ...noteToMove,
        folderId: newFolderId,
        dateUpdated: new Date().toISOString(),
      };

      if (isOnline) {
        const response = await apiClient.put(`http://127.0.0.1:5000/notes/${noteId}`, updatedData);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to move note' }));
          throw new Error(errorData?.error || 'Failed to move note');
        }

        const updatedNote = await response.json();
        setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)));

        if (selectedNote?.id === noteId) {
          setSelectedNote(updatedNote);
        }
      } else {
        // Fallback for offline mode
        setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedData : note)));

        if (selectedNote?.id === noteId) {
          setSelectedNote(updatedData);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Error moving note:', err);
    }
  };

  const toggleFolderExpanded = (folderId) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleToolbarAction = (action) => {
    console.log(`Toolbar action: ${action}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleUpdateContent();
    }, 1000);

    return () => clearTimeout(timer);
  }, [editingContent]);

  return (
    <div className='min-h-screen bg-gray-100 flex'>
      {/* Left Sidebar - Folders */}
      <div className='w-80 bg-white shadow-lg flex flex-col'>
        {/* Header */}
        <div className='p-4 border-b border-gray-200'>
          <div className='flex items-center justify-between mb-4'>
            <h1 className='text-lg font-semibold text-gray-800'>Quick Notes</h1>
            <Header />
          </div>

          {/* Navigation */}
          <div className='flex items-center gap-4 mb-4'>
            <button
              onClick={() => window.history.back()}
              className='p-2 rounded-full hover:bg-gray-100'
            >
              <ChevronLeft className='w-5 h-5 text-gray-600' />
            </button>

            {/* Tab Navigation */}
            <div className='flex gap-2 flex-wrap'>
              {[
                { title: 'calendar', color: '#FAFAF5', href: '/calendar' },
                { title: 'habit tracker', color: '#FEF9F5', href: '/habit-traker' },
                { title: 'goals', color: '#F3D9DA', href: '/error' },
                { title: 'matrix', color: '#FFF4B3', href: '/matrix' },
                { title: 'to-do lists', color: '#F0F8FF', href: '/todo-list' },
              ].map((tab) => (
                <div
                  key={tab.title}
                  className='px-3 py-2 rounded-xl text-xs font-medium cursor-pointer hover:shadow-md transition-shadow'
                  style={{ backgroundColor: tab.color }}
                  onClick={() => (window.location.href = tab.href)}
                >
                  {tab.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Note Section */}
        <div className='p-4 border-b border-gray-200'>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className='flex items-center gap-2 text-gray-700 hover:text-black transition-colors'
            disabled={loading}
          >
            <Plus className='w-4 h-4' />
            Create a note
          </button>

          {isCreating && (
            <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
              <div className='mb-3'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                <input
                  type='text'
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter note title'
                  disabled={loading}
                />
              </div>

              <div className='mb-3'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Choose folder
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(parseInt(e.target.value))}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  disabled={loading}
                >
                  {folders
                    .filter((f) => !f.isSpecial)
                    .map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={() => setIsCreating(false)}
                  className='px-4 py-2 text-sm text-gray-600 hover:text-gray-800'
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className='px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className='mx-4 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <p className='text-sm text-blue-600'>Loading...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className='mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{error}</p>
            <button
              onClick={() => setError(null)}
              className='text-xs text-red-500 hover:text-red-700 mt-1'
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Last Saved Indicator */}
        {lastSaved && (
          <div className='mx-4 mb-2 text-xs text-gray-500'>
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}

        {/* Folders and Notes List */}
        <div className='flex-1 overflow-y-auto'>
          {sortedFolders.map((folder) => (
            <div key={folder.id}>
              {/* Folder Header */}
              <div
                onClick={() => {
                  if (folder.isSpecial) {
                    setActiveFolder(folder.id);
                  } else {
                    toggleFolderExpanded(folder.id);
                    setActiveFolder(folder.id);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  activeFolder === folder.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                {folder.isSpecial ? (
                  <FileText className='w-4 h-4 text-gray-500' />
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolderExpanded(folder.id);
                      }}
                      className='hover:bg-gray-200 rounded p-1'
                    >
                      {expandedFolders.has(folder.id) ? (
                        <ChevronDown className='w-3 h-3 text-gray-500' />
                      ) : (
                        <ChevronRight className='w-3 h-3 text-gray-500' />
                      )}
                    </button>
                    {expandedFolders.has(folder.id) ? (
                      <FolderOpen className='w-4 h-4' style={{ color: folder.color }} />
                    ) : (
                      <Folder className='w-4 h-4' style={{ color: folder.color }} />
                    )}
                  </>
                )}
                <span className='text-sm text-gray-700 font-medium'>{folder.name}</span>
                <span className='ml-auto text-xs text-gray-500'>({folder.noteCount})</span>
              </div>

              {/* Notes in Folder */}
              {(folder.isSpecial ? activeFolder === folder.id : expandedFolders.has(folder.id)) && (
                <div className='bg-gray-50'>
                  {(folder.isSpecial ? filteredNotes : getNotesForFolder(folder.id)).map((note) => (
                    <div
                      key={note.id}
                      className={`pl-8 pr-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex justify-between items-center ${
                        selectedNote?.id === note.id
                          ? 'bg-blue-100 border-l-4 border-l-blue-500'
                          : ''
                      }`}
                    >
                      <div onClick={() => handleSelectNote(note)} className='flex-1 min-w-0'>
                        <h4 className='text-sm font-medium text-gray-800 truncate'>{note.title}</h4>
                        <p className='text-xs text-gray-500 mt-1 line-clamp-2 truncate'>
                          {(note.content || '').substring(0, 60)}...
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                          {new Date(note.dateUpdated || note.date_updated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 ml-2'>
                        <select
                          value={getNoteFolder(note)}
                          onChange={(e) => handleMoveNote(note.id, parseInt(e.target.value))}
                          className='text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          title='Move to folder'
                          onClick={(e) => e.stopPropagation()}
                          disabled={loading}
                        >
                          {folders
                            .filter((f) => !f.isSpecial)
                            .map((folder) => (
                              <option
                                key={folder.id}
                                value={folder.id}
                                disabled={getNoteFolder(note) === folder.id}
                              >
                                {folder.name}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this note?')) {
                              handleDeleteNote(note.id);
                            }
                          }}
                          className='p-1 text-red-500 hover:bg-red-50 rounded-full disabled:opacity-50'
                          title='Delete note'
                          disabled={loading}
                        >
                          <Trash2 className='w-3 h-3' />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(folder.isSpecial ? filteredNotes : getNotesForFolder(folder.id)).length ===
                    0 && (
                    <div className='pl-8 pr-4 py-4 text-xs text-gray-500 italic'>
                      No notes in this folder
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className='p-4'>
          <div className='w-32 h-32 mx-auto'>
            <div className='w-full h-full bg-pink-100 rounded-2xl flex items-center justify-center'>
              <img className='text-4xl' src='./images/bunny.webp' />
            </div>
          </div>
        </div>
      </div>

      <div className='flex-1 flex flex-col'>
        {selectedNote ? (
          <>
            <div className='bg-white border-b border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <h2 className='text-2xl font-semibold text-gray-800'>{selectedNote.title}</h2>
                    <span
                      className='px-2 py-1 text-xs rounded-full text-white font-medium'
                      style={{
                        backgroundColor:
                          folders.find(
                            (f) => f.id === (selectedNote.folderId || selectedNote.folder_id),
                          )?.color || '#6B7280',
                      }}
                    >
                      {folders.find(
                        (f) => f.id === (selectedNote.folderId || selectedNote.folder_id),
                      )?.name || 'Unknown'}
                    </span>
                  </div>
                  <p className='text-sm text-gray-500'>
                    Last updated:{' '}
                    {new Date(
                      selectedNote.dateUpdated || selectedNote.date_updated,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className='flex-1 bg-white p-6'>
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className='w-full h-full resize-none border-none outline-none text-gray-700 leading-relaxed text-base'
                placeholder='Start writing your note...'
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Editor Toolbar */}
            <EditorToolbar onAction={handleToolbarAction} />
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center'>
              <FileText className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-500'>Select a note to start editing</p>
              <p className='text-sm text-gray-400 mt-2'>
                {filteredNotes.length === 0
                  ? 'Create your first note to get started'
                  : 'Choose from your notes on the left'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
