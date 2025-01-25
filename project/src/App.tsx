import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle, ListTodo, Search, X, AlertCircle } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: crypto.randomUUID(),
          text: newTodo.trim(),
          completed: false,
          createdAt: Date.now()
        }
      ]);
      setNewTodo('');
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <ListTodo className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Todo List</h1>
          </div>

          <form onSubmit={addTodo} className="mb-6 relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Add
              </button>
            </div>
            {showError && (
              <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please enter a task
              </div>
            )}
          </form>

          <div className="mb-6 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search todos..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {todos.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-indigo-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                {todos.length === 0
                  ? 'No todos yet. Add one above!'
                  : 'No todos match your current filters.'}
              </p>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors duration-200"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
                  >
                    {todo.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <span className={`flex-1 text-gray-800 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 hover:bg-red-100 rounded transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>

          {todos.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
              <span>
                {completedCount} of {totalCount} tasks completed
              </span>
              {completedCount > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Clear completed
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;