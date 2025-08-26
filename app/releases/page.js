import { useState } from 'react';
import { useReleases } from '../../lib/hooks/useReleases';
import { useTracksForRelease } from '../../lib/hooks/useTracksForRelease';
import { addDoc, collection, Timestamp, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Comments from '../../components/Comments';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { useAuth } from '../../lib/auth';
import { usePlaylists } from '../../lib/hooks/usePlaylists';

const ReleaseItem = ({ release }) => {
  const { tracks, loading } = useTracksForRelease(release.id);
  const { user } = useAuth();
  const { playlists } = usePlaylists();

  const handlePlay = async (trackId) => {
    await addDoc(collection(db, 'plays'), {
      trackId,
      timestamp: Timestamp.now()
    });
  };

  const handleLike = async () => {
    if (user) {
      await updateDoc(doc(db, 'releases', release.id), {
        'stats.likes': release.stats.likes + 1
      });
    }
  };

  const handleAddToPlaylist = async (playlistId, trackId) => {
    await updateDoc(doc(db, 'playlists', playlistId), {
      tracks: arrayUnion(trackId)
    });
  };

  const shareUrl = window.location.href;
  const title = release.title;

  return (
    <div className="mb-8">
      <div className="flex space-x-4">
        {release.artworkUrl && <img src={release.artworkUrl} alt={release.title} className="w-32 h-32 rounded" />}
        <div>
          <h3 className="text-xl font-bold">{release.title}</h3>
          <p>{release.description}</p>
          <p>{release.type} - {release.releaseDate?.toLocaleDateString()}</p>
          <div className="mt-2">
            {Object.entries(release.streamingLinks || {}).map(([key, url]) => url && (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="mr-4 text-blue-400">{key}</a>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleLike} className="bg-blue-600 p-2 rounded">Like ({release.stats.likes})</button>
      <div>
        <FacebookShareButton url={shareUrl} quote={title}>
          Share on Facebook
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={title}>
          Share on Twitter
        </TwitterShareButton>
      </div>
      <Comments releaseId={release.id} />
      {loading ? <p>Loading tracks...</p> : (
        <ul className="mt-4">
          {tracks.map(track => (
            <li key={track.id} className="mb-2">
              {track.trackNumber}. {track.title} ({track.duration})
              <audio controls src={track.audioUrl} onPlay={() => handlePlay(track.id)} className="ml-4" />
              <select onChange={(e) => handleAddToPlaylist(e.target.value, track.id)} className="ml-2">
                <option value="">Add to Playlist</option>
                {playlists.map(pl => <option key={pl.id} value={pl.id}>{pl.name}</option>)}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function ReleasesPage() {
  const { releases, loading } = useReleases();
  const [search, setSearch] = useState('');

  if (loading) return <div className="p-8">Loading...</div>;

  const filtered = releases.filter(r => r.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Releases</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search releases" className="p-2 bg-gray-800 rounded mb-4" />
      {filtered.map(release => (
        <ReleaseItem key={release.id} release={release} />
      ))}
    </div>
  );
}