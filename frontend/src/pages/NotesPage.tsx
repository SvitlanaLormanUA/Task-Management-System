import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Settings, User, Image, Type, FileText, Copy, Trash2, Users, Heart, Printer, Download, Maximize2, MoreHorizontal, List, AlignLeft, Bold, Italic, Underline, Link, Code, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

// Mock data for demonstration
const mockNotes = [
  {
    id: 1,
    title: "Meeting Notes",
    content: "This is a note about the team meeting. We discussed project timelines and deliverables.\n\nAction items:\n- Complete design mockups\n- Review code changes\n- Schedule client call",
    dateCreated: new Date('2024-06-15').toISOString(),
    dateUpdated: new Date('2024-06-18').toISOString(),
    userId: 1,
    folderId: 1
  },
  {
    id: 2,
    title: "Project Ideas",
    content: "Brainstorming session for new features:\n\n1. Dark mode implementation\n2. Mobile app development\n3. Integration with third-party APIs\n\nPriority: High for dark mode",
    dateCreated: new Date('2024-06-14').toISOString(),
    dateUpdated: new Date('2024-06-17').toISOString(),
    userId: 1,
    folderId: 1
  },
  {
    id: 3,
    title: "Personal Goals",
    content: "2024 Goals:\n- Learn React Native\n- Complete certification\n- Read 12 books\n- Exercise 3x per week\n\nProgress tracking needed.",
    dateCreated: new Date('2024-06-10').toISOString(),
    dateUpdated: new Date('2024-06-16').toISOString(),
    userId: 1,
    folderId: 2
  },
  {
    id: 4,
    title: "Recipe Collection",
    content: "Favorite recipes to try:\n\n🍝 Pasta Carbonara\n🥗 Mediterranean Salad\n🍰 Chocolate Cake\n\nNeed to organize shopping list.",
    dateCreated: new Date('2024-06-12').toISOString(),
    dateUpdated: new Date('2024-06-15').toISOString(),
    userId: 1,
    folderId: 2
  },
  {
    id: 5,
    title: "Book Notes",
    content: "Currently reading: 'The Pragmatic Programmer'\n\nKey takeaways:\n- DRY principle\n- Code reviews importance\n- Testing strategies\n\nNext: 'Clean Code'",
    dateCreated: new Date('2024-06-11').toISOString(),
    dateUpdated: new Date('2024-06-14').toISOString(),
    userId: 1,
    folderId: 3
  }
];

// Toolbar Component
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
    <div className="bg-blue-50 border-t border-gray-200 p-4">
      <div className="flex items-center gap-2 flex-wrap">
        {toolbarItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={() => handleToolbarAction(item.action)}
              className="p-2 rounded hover:bg-blue-200 transition-colors"
              title={item.tooltip}
            >
              <IconComponent className="w-4 h-4 text-gray-600" />
            </button>
          );
        })}
        <div className="ml-auto">
          <button
            onClick={() => handleToolbarAction('more')}
            className="p-2 rounded hover:bg-blue-200 transition-colors"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotesPage = () => {
  const [notes, setNotes] = useState(mockNotes);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(1);
  const [editingContent, setEditingContent] = useState('');
  const [activeFolder, setActiveFolder] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState(new Set([1, 2, 3, 4, 5, 6]));
  const [error, setError] = useState(null);

  // Mock folders data with better organization
  const folders = [
    { id: 0, name: 'All Notes', noteCount: notes.length, isSpecial: true },
    { id: 1, name: 'Work', noteCount: notes.filter(n => n.folderId === 1).length, color: '#3B82F6' },
    { id: 2, name: 'Personal', noteCount: notes.filter(n => n.folderId === 2).length, color: '#10B981' },
    { id: 3, name: 'Learning', noteCount: notes.filter(n => n.folderId === 3).length, color: '#8B5CF6' },
    { id: 4, name: 'Projects', noteCount: notes.filter(n => n.folderId === 4).length, color: '#F59E0B' },
    { id: 5, name: 'Archive', noteCount: notes.filter(n => n.folderId === 5).length, color: '#6B7280' },
    { id: 6, name: 'Ideas', noteCount: notes.filter(n => n.folderId === 6).length, color: '#EC4899' },
  ];

  // Filter notes based on active folder
  const filteredNotes = activeFolder === 0 ? notes : notes.filter(note => note.folderId === activeFolder);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) {
      setError('Note title is required');
      return;
    }
    if (!folders.find(f => f.id === selectedFolderId && f.id !== 0)) {
      setError('Invalid folder selected');
      return;
    }
    
    const newNote = {
      id: Date.now(),
      title: newNoteTitle,
      content: '',
      folderId: selectedFolderId,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      userId: 1
    };
    
    setNotes(prev => [...prev, newNote]);
    setSelectedNote(newNote);
    setEditingContent(newNote.content);
    setIsCreating(false);
    setNewNoteTitle('');
    setActiveFolder(selectedFolderId);
    setError(null);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setEditingContent(note.content);
  };

  const handleUpdateContent = async () => {
    if (selectedNote && editingContent !== selectedNote.content) {
      const updatedNote = {
        ...selectedNote,
        content: editingContent,
        dateUpdated: new Date().toISOString()
      };
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
    }
  };

  const handleDeleteNote = async (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setEditingContent('');
    }
  };

  const handleMoveNote = async (noteId, newFolderId) => {
    const validFolder = folders.find(folder => folder.id === newFolderId && folder.id !== 0);
    if (!validFolder) {
      setError('Invalid folder selected.');
      return;
    }
    
    const updatedNote = notes.find(note => note.id === noteId);
    if (updatedNote) {
      const newNote = {
        ...updatedNote,
        folderId: newFolderId,
        dateUpdated: new Date().toISOString()
      };
      
      setNotes(prev => prev.map(note => 
        note.id === noteId ? newNote : note
      ));
      
      if (selectedNote?.id === noteId) {
        setSelectedNote(newNote);
      }
    }
  };

  const toggleFolderExpanded = (folderId) => {
    setExpandedFolders(prev => {
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

  // Auto-save content after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      handleUpdateContent();
    }, 1000);

    return () => clearTimeout(timer);
  }, [editingContent]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Sidebar - Folders */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-800">Quick Notes</h1>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <User className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Tab Navigation */}
            <div className="flex gap-2 flex-wrap">
              {[
                { title: 'calendar', color: '#FAFAF5' },
                { title: 'habit tracker', color: '#FEF9F5' },
                { title: 'goals', color: '#F3D9DA' },
                { title: 'matrix', color: '#FFF4B3' },
                { title: 'to-do lists', color: '#F0F8FF' },
              ].map((tab) => (
                <div
                  key={tab.title}
                  className="px-3 py-2 rounded-xl text-xs font-medium cursor-pointer hover:shadow-md transition-shadow"
                  style={{ backgroundColor: tab.color }}
                >
                  {tab.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create Note Section */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create a note
          </button>
          
          {isCreating && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter note title"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Choose folder</label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {folders.filter(f => !f.isSpecial).map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Folders and Notes List */}
        <div className="flex-1 overflow-y-auto">
          {folders.map((folder) => (
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
                  <FileText className="w-4 h-4 text-gray-500" />
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFolderExpanded(folder.id);
                      }}
                      className="hover:bg-gray-200 rounded p-1"
                    >
                      {expandedFolders.has(folder.id) ? (
                        <ChevronDown className="w-3 h-3 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-gray-500" />
                      )}
                    </button>
                    {expandedFolders.has(folder.id) ? (
                      <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
                    ) : (
                      <Folder className="w-4 h-4" style={{ color: folder.color }} />
                    )}
                  </>
                )}
                <span className="text-sm text-gray-700 font-medium">{folder.name}</span>
                <span className="ml-auto text-xs text-gray-500">({folder.noteCount})</span>
              </div>
              
              {/* Notes in Folder */}
              {(folder.isSpecial ? activeFolder === folder.id : expandedFolders.has(folder.id)) && (
                <div className="bg-gray-50">
                  {(folder.isSpecial ? filteredNotes : notes.filter(note => note.folderId === folder.id)).map((note) => (
                    <div
                      key={note.id}
                      className={`pl-8 pr-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex justify-between items-center ${
                        selectedNote?.id === note.id ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div
                        onClick={() => handleSelectNote(note)}
                        className="flex-1 min-w-0"
                      >
                        <h4 className="text-sm font-medium text-gray-800 truncate">{note.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 truncate">
                          {note.content.substring(0, 60)}...
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(note.dateUpdated).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <select
                          value={note.folderId || 1}
                          onChange={(e) => handleMoveNote(note.id, parseInt(e.target.value))}
                          className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          title="Move to folder"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {folders.filter(f => !f.isSpecial).map(folder => (
                            <option 
                              key={folder.id} 
                              value={folder.id}
                              disabled={note.folderId === folder.id}
                            >
                              {folder.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(folder.isSpecial ? filteredNotes : notes.filter(note => note.folderId === folder.id)).length === 0 && (
                    <div className="pl-8 pr-4 py-4 text-xs text-gray-500 italic">
                      No notes in this folder
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Character Image */}
        <div className="p-4">
          <div className="w-32 h-32 mx-auto">
            <div className="w-full h-full bg-pink-100 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">🐰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            {/* Note Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-semibold text-gray-800">{selectedNote.title}</h2>
                    <span 
                      className="px-2 py-1 text-xs rounded-full text-white font-medium"
                      style={{ backgroundColor: folders.find(f => f.id === selectedNote.folderId)?.color || '#6B7280' }}
                    >
                      {folders.find(f => f.id === selectedNote.folderId)?.name || 'Unknown'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(selectedNote.dateUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex-1 bg-white p-6">
              <textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                className="w-full h-full resize-none border-none outline-none text-gray-700 leading-relaxed text-base"
                placeholder="Start writing your note..."
                style={{ minHeight: '400px' }}
              />
            </div>

            {/* Editor Toolbar */}
            <EditorToolbar onAction={handleToolbarAction} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a note to start editing</p>
              <p className="text-sm text-gray-400 mt-2">
                {filteredNotes.length === 0 ? 'Create your first note to get started' : 'Choose from your notes on the left'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;