"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Clock } from "lucide-react";
import Image from "next/image";
import safeplanet from "@/public/channels4_profile.jpg";
import hss from "@/public/hq720.jpg";
import tele from "@/public/tele.jpg";

const songs = [
  {
    id: 1,
    title: "ในเมื่อใจ (The Heart)",
    artist: "Safeplanet",
    duration: "4:01",
    album: "Cap, Capo, Cigarettes & Beer",
    cover: safeplanet,
    audio: "/TheHeart.mp3",
  },
  {
    id: 2,
    title: "happy sad song",
    artist: "Youth Brush",
    duration: "3:43",
    album: "happy sad song",
    cover: hss,
    audio: "/HSS.mp3",
  },
  {
    id: 3,
    title: "แค่ปล่อยให้เป็นแบบนี้ (Aight)",
    artist: "Television off",
    duration: "4:58",
    album: "Creatures",
    cover: tele,
    audio: "/aight.mp3",
  },
];

export default function Home() {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new window.Audio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (currentSong) {
      audio.src = currentSong.audio;
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audio.pause();
      }
    }

    const timeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", timeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", timeUpdate);
    };
  }, [currentSong, isPlaying]);

  const handlePlay = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = song.audio;
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const nextSong = songs[(currentIndex + 1) % songs.length];
      setCurrentSong(nextSong);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(
        (song) => song.id === currentSong.id
      );
      const previousSong =
        songs[(currentIndex - 1 + songs.length) % songs.length];
      setCurrentSong(previousSong);
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Playlist Header */}
      <div className="h-[40vh] bg-gradient-to-b from-green-500 via-green-700 to-black p-8 relative">
        <div
          className="absolute inset-0 bg-black opacity-50"
          style={{
            backgroundImage: `url(${
              currentSong?.cover || "/placeholder.svg?height=400&width=400"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        ></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold mb-4">Daily Mix 1</h1>
          <p className="text-sm text-gray-300">
            Safeplanet, Youth Brush, Television off and more
          </p>
          <p className="text-sm text-gray-300">3 songs, about 12.42 min</p>
        </div>
      </div>

      {/* Song List */}
      <div className="px-8 py-4">
        <div className="flex items-center text-sm text-gray-400 px-4 py-2 border-b border-gray-800">
          <span className="w-8">#</span>
          <span className="flex-1">TITLE</span>
          <span className="w-1/3">ALBUM</span>
          <Clock className="w-4 h-4" />
        </div>
        <div className="space-y-2 mt-4">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className={`flex items-center p-2 rounded-lg hover:bg-white/10 cursor-pointer ${
                currentSong?.id === song.id ? "bg-white/20" : ""
              }`}
              onClick={() => handlePlay(song)}
            >
              <span className="w-8 text-sm text-gray-400">{index + 1}</span>
              <div className="flex items-center flex-1 gap-2">
                <div className="w-14 h-14 overflow-hidden">
                  <Image
                    src={song.cover || "/placeholder.svg"}
                    alt={song.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-sm mr-4"
                  />
                </div>
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </div>
              <span className="w-1/3 text-sm text-gray-400">{song.album}</span>
              <span className="text-sm text-gray-400">{song.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/80 p-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {currentSong && (
            <>
              <div className="flex items-center w-1/4 gap-2">
                <div className="w-14 h-14 overflow-hidden">
                  <Image
                    src={currentSong.cover || "/placeholder.svg"}
                    alt={currentSong.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-sm mr-4"
                  />
                </div>
                <div>
                  <p className="font-medium">{currentSong.title}</p>
                  <p className="text-sm text-gray-400">{currentSong.artist}</p>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/2">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handlePrevious}
                    className="text-gray-400 hover:text-white"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleTogglePlay}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-black" />
                    ) : (
                      <Play className="w-4 h-4 text-black ml-1" />
                    )}
                  </button>
                  <button
                    onClick={handleNext}
                    className="text-gray-400 hover:text-white"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-400">
                    {formatTime(currentTime)}
                  </span>
                  <div className="flex-1 h-1 bg-gray-600 rounded-full">
                    <div
                      className="h-1 bg-white rounded-full"
                      style={{
                        width: `${(currentTime / 180) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {currentSong.duration}
                  </span>
                </div>
              </div>
              <div className="w-1/4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
