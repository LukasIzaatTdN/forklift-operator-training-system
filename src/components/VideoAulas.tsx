import { useState, useEffect } from 'react';
import { VideoLesson } from '../types';
import { removeVideoLesson, subscribeVideoLessons, upsertVideoLesson } from '../lib/videoLessons';

interface VideoAulasProps {
  isAdmin: boolean;
}

const categories = [
  { id: 'todas', label: 'Todas', emoji: '🎬', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', ring: 'ring-violet-500' },
  { id: 'operacao', label: 'Operação', emoji: '⚙️', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', ring: 'ring-blue-500' },
  { id: 'seguranca', label: 'Segurança', emoji: '🛡️', color: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', ring: 'ring-red-500' },
  { id: 'manutencao', label: 'Manutenção', emoji: '🔧', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', ring: 'ring-amber-500' },
  { id: 'cargas', label: 'Manuseio de Cargas', emoji: '📦', color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-500' },
  { id: 'direcao', label: 'Direção Defensiva', emoji: '🚗', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', ring: 'ring-indigo-500' },
];

const categoryLabelMap: Record<string, string> = {
  operacao: 'Operação',
  seguranca: 'Segurança',
  manutencao: 'Manutenção',
  cargas: 'Manuseio de Cargas',
  direcao: 'Direção Defensiva',
};

const categoryEmojiMap: Record<string, string> = {
  operacao: '⚙️',
  seguranca: '🛡️',
  manutencao: '🔧',
  cargas: '📦',
  direcao: '🚗',
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

function getYouTubeThumbnail(url: string): string {
  const videoId = extractYouTubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}

export default function VideoAulas({ isAdmin }: VideoAulasProps) {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formCategory, setFormCategory] = useState('operacao');
  const [formDuration, setFormDuration] = useState('');
  const [formError, setFormError] = useState('');
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [savingVideo, setSavingVideo] = useState(false);

  // Load videos (tempo real)
  useEffect(() => {
    const unsubscribe = subscribeVideoLessons(
      (nextVideos) => {
        setVideos(nextVideos);
        setLoadingVideos(false);
      },
      () => {
        setFormError('Falha ao sincronizar videoaulas em tempo real.');
        setLoadingVideos(false);
      }
    );

    return unsubscribe;
  }, []);

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === 'todas' || video.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle add/edit video
  const handleSaveVideo = async () => {
    setFormError('');

    if (!formTitle.trim()) {
      setFormError('Informe o título da videoaula.');
      return;
    }
    if (!formUrl.trim()) {
      setFormError('Informe a URL do vídeo (YouTube).');
      return;
    }

    const videoId = extractYouTubeId(formUrl);
    if (!videoId) {
      setFormError('URL do YouTube inválida. Use um link como: https://www.youtube.com/watch?v=... ou https://youtu.be/...');
      return;
    }

    setSavingVideo(true);
    try {
      const existingVideo = editingVideoId ? videos.find((video) => video.id === editingVideoId) : null;
      const videoToSave: VideoLesson = {
        id: editingVideoId || `custom-${Date.now()}`,
        title: formTitle.trim(),
        description: formDescription.trim() || 'Videoaula adicionada pelo usuário.',
        url: formUrl.trim(),
        category: formCategory,
        duration: formDuration.trim() || '—:—',
        addedAt: existingVideo?.addedAt || Date.now(),
      };

      await upsertVideoLesson(videoToSave);
      resetForm();
      setShowAddModal(false);
    } catch {
      setFormError('Não foi possível salvar a videoaula. Tente novamente.');
    } finally {
      setSavingVideo(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormUrl('');
    setFormCategory('operacao');
    setFormDuration('');
    setFormError('');
    setEditingVideoId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (video: VideoLesson) => {
    setFormTitle(video.title);
    setFormDescription(video.description || '');
    setFormUrl(video.url);
    setFormCategory(video.category);
    setFormDuration(video.duration);
    setFormError('');
    setEditingVideoId(video.id);
    setShowAddModal(true);
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await removeVideoLesson(id);
      setShowDeleteConfirm(null);
      if (selectedVideo?.id === id) {
        setSelectedVideo(null);
      }
    } catch {
      setFormError('Não foi possível remover a videoaula.');
      setShowDeleteConfirm(null);
    }
  };

  const isDefaultVideo = (id: string) => id.startsWith('default-');
  const deletingVideo = showDeleteConfirm ? videos.find((video) => video.id === showDeleteConfirm) : null;

  // Video player modal
  const VideoPlayerModal = () => {
    if (!selectedVideo) return null;
    const embedUrl = getYouTubeEmbedUrl(selectedVideo.url);
    const catInfo = categories.find((c) => c.id === selectedVideo.category) || categories[0];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{categoryEmojiMap[selectedVideo.category] || '🎬'}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-base">{selectedVideo.title}</h3>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${catInfo.bg} ${catInfo.text} mt-0.5`}>
                  {categoryLabelMap[selectedVideo.category]}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Video */}
          <div className="aspect-video bg-black">
            <iframe
              src={embedUrl}
              title={selectedVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Info */}
          <div className="p-5">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">⏱️ {selectedVideo.duration}</span>
              {!isDefaultVideo(selectedVideo.id) && (
                <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                  Adicionada pelo administrador
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{selectedVideo.description}</p>
          </div>
        </div>
      </div>
    );
  };

  // Add/Edit Video Modal (Admin only)
  const AddVideoModal = () => {
    if (!showAddModal) return null;
    const isEditing = Boolean(editingVideoId);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowAddModal(false); resetForm(); }}>
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎬</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{isEditing ? 'Editar Videoaula' : 'Adicionar Videoaula'}</h3>
                  <p className="text-violet-200 text-xs">
                    {isEditing ? 'Atualize os dados da videoaula selecionada' : 'Cole o link do YouTube e preencha os dados'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título da Videoaula *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: Como operar empilhadeira elétrica"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL do YouTube *</label>
              <input
                type="text"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Suporta: youtube.com/watch, youtu.be, youtube.com/embed, youtube.com/shorts</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descrição</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descreva o conteúdo da videoaula..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Category & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoria</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                >
                  <option value="operacao">⚙️ Operação</option>
                  <option value="seguranca">🛡️ Segurança</option>
                  <option value="manutencao">🔧 Manutenção</option>
                  <option value="cargas">📦 Manuseio de Cargas</option>
                  <option value="direcao">🚗 Direção Defensiva</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duração</label>
                <input
                  type="text"
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                  placeholder="Ex: 12:30"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Preview */}
            {extractYouTubeId(formUrl) && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pré-visualização</p>
                <div className="flex items-start gap-3">
                  <img
                    src={getYouTubeThumbnail(formUrl)}
                    alt="Thumbnail"
                    className="w-24 h-16 object-cover rounded-lg bg-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formTitle || 'Título não informado'}</p>
                    <p className="text-xs text-gray-500 mt-1">✅ URL do YouTube válida</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => { setShowAddModal(false); resetForm(); }}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleSaveVideo()}
              disabled={savingVideo}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-md shadow-violet-200"
            >
              {savingVideo ? 'Salvando...' : isEditing ? '💾 Salvar Alterações' : '➕ Adicionar Videoaula'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">🎬 Videoaulas Práticas</h1>
            <p className="text-violet-200 text-sm md:text-base max-w-xl">
              Aprenda com vídeos práticos sobre operação, segurança e manutenção de empilhadeiras.
              {isAdmin && ' Adicione seus próprios vídeos para enriquecer o treinamento!'}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-3 bg-white text-violet-700 font-semibold rounded-xl text-sm hover:bg-violet-50 transition-colors shadow-md self-start"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Videoaula
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar videoaulas..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-md`
                  : `bg-white border border-gray-200 text-gray-600 hover:border-gray-300`
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {cat.id === 'todas' && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === 'todas' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {videos.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loadingVideos
            ? 'Sincronizando videoaulas...'
            : `${filteredVideos.length} videoaula${filteredVideos.length !== 1 ? 's' : ''} encontrada${filteredVideos.length !== 1 ? 's' : ''}`}
        </p>
        {selectedCategory !== 'todas' && (
          <button
            onClick={() => setSelectedCategory('todas')}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <span className="text-6xl mb-4 block">🎬</span>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma videoaula encontrada</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchTerm ? 'Tente buscar com outros termos.' : 'Aguarde o administrador adicionar videoaulas.'}
          </p>
          {isAdmin && !searchTerm && (
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all"
            >
              ➕ Adicionar Videoaula
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const catInfo = categories.find((c) => c.id === video.category) || categories[0];
            const thumbnail = getYouTubeThumbnail(video.url);
            const isCustom = !isDefaultVideo(video.id);

            return (
              <div
                key={video.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-video bg-gray-100 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedVideo(video)}
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="fallback-icon flex items-center justify-center h-full">
                      <span className="text-5xl opacity-30">🎬</span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 rounded-full p-4 shadow-lg">
                      <svg className="w-8 h-8 text-violet-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md">
                    {video.duration}
                  </div>

                  {/* Custom badge */}
                  {isCustom && (
                    <div className="absolute top-2 left-2 bg-violet-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                      ✦ Admin
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className={`absolute top-2 right-2 ${video.duration !== '—:—' || isCustom ? 'right-2' : ''} text-white text-xs font-medium px-2 py-1 rounded-md bg-black/60`}>
                    {categoryEmojiMap[video.category]} {categoryLabelMap[video.category]}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-violet-700 transition-colors cursor-pointer"
                    onClick={() => setSelectedVideo(video)}>
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{video.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${catInfo.bg} ${catInfo.text}`}>
                      {catInfo.emoji} {categoryLabelMap[video.category]}
                    </span>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(video);
                          }}
                          className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Editar videoaula"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L12 15l-4 1 1-4 9.586-9.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(video.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover videoaula"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal (Admin only) */}
      {isAdmin && showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Remover Videoaula?</h3>
              <p className="text-sm text-gray-500">
                {deletingVideo && isDefaultVideo(deletingVideo.id)
                  ? 'Este vídeo padrão será ocultado para os usuários.'
                  : 'Esta ação não pode ser desfeita.'}
              </p>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => void handleDeleteVideo(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <VideoPlayerModal />
      {isAdmin && <AddVideoModal />}
    </div>
  );
}
