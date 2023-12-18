/**
 * This code is taken from https://github.com/tidalcycles/strudel/pull/839. The logic is written by 
 * daslyfe (Jade Rose Rowland). I have tweaked it a bit to fit the needs of this project (TypeScript),
 * etc... Many thanks for this piece of code! This code is initially part of the Strudel project:
 * https://github.com/tidalcycles/strudel.
 */

// @ts-ignore
import { registerSound, onTriggerSample }  from "superdough";

export const isAudioFile = (filename: string) => ['wav', 'mp3'].includes(filename.split('.').slice(-1)[0]);

interface samplesDBConfig {
    dbName: string,
    table: string,
    columns: string[],
    version: number
}

export const samplesDBConfig = {
    dbName: 'samples',
    table: 'usersamples',
    columns: ['data_url', 'title'],
    version: 1
}

async function bufferToDataUrl(buf: Buffer) {
  return new Promise((resolve) => {
    var blob = new Blob([buf], { type: 'application/octet-binary' });
    var reader = new FileReader();
    reader.onload = function (event: Event) {
      // @ts-ignore
      resolve(event.target.result);
    };
    reader.readAsDataURL(blob);
  });
}

const processFilesForIDB = async (files: FileList) => {
  return await Promise.all(
    Array.from(files)
      .map(async (s: File) => {
        const title = s.name;
        if (!isAudioFile(title)) {
          return;
        }
        //create obscured url to file system that can be fetched
        const sUrl = URL.createObjectURL(s);
        //fetch the sound and turn it into a buffer array
        const buf = await fetch(sUrl).then((res) => res.arrayBuffer());
        //create a url blob containing all of the buffer data
        // @ts-ignore
        // TODO: conversion to do here, remove ts-ignore
        const base64 = await bufferToDataUrl(buf);
        return {
          title,
          blob: base64,
          id: s.webkitRelativePath,
        };
      })
      .filter(Boolean),
  ).catch((error) => {
    console.log('Something went wrong while processing uploaded files', error);
  });
};


export const registerSamplesFromDB = (config: samplesDBConfig, onComplete = () => {}) => {
  openDB(config, (objectStore: IDBObjectStore) => {
    let query = objectStore.getAll();
    query.onsuccess = (event: Event) => {
      // @ts-ignore
      const soundFiles = event.target.result;
      if (!soundFiles?.length) {
        return;
      }
      const sounds = new Map();
      [...soundFiles]
        .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }))
        .forEach((soundFile) => {
          const title = soundFile.title;
          if (!isAudioFile(title)) {
            return;
          }
          const splitRelativePath = soundFile.id?.split('/');
          const parentDirectory = splitRelativePath[splitRelativePath.length - 2];
          const soundPath = soundFile.blob;
          const soundPaths = sounds.get(parentDirectory) ?? new Set();
          soundPaths.add(soundPath);
          sounds.set(parentDirectory, soundPaths);
        });

      sounds.forEach((soundPaths, key) => {
        const value = Array.from(soundPaths);
        // @ts-ignore
        registerSound(key, (t, hapValue, onended) => onTriggerSample(t, hapValue, onended, value), {
          type: 'sample',
          samples: value,
          baseUrl: undefined,
          prebake: false,
          tag: "user",
        });
      });
      onComplete();
    };
  });
};

export const openDB = (config: samplesDBConfig, onOpened: Function) => {
    const { dbName, version, table, columns } = config

    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB')
        return
    }
    const dbOpen = indexedDB.open(dbName, version);


    dbOpen.onupgradeneeded = (_event) => {
      const db = dbOpen.result;
      const objectStore = db.createObjectStore(table, { keyPath: 'id', autoIncrement: false });
      columns.forEach((c: any) => {
        objectStore.createIndex(c, c, { unique: false });
      });
    };
    dbOpen.onerror = function (err: Event) {
        console.log('Error opening DB: ', (err.target as IDBOpenDBRequest).error);
    }
    dbOpen.onsuccess = function (_event: Event) {
        const db = dbOpen.result;
        db.onversionchange = function() {
            db.close();
            alert("Database is outdated, please reload the page.")
        };
        const writeTransaction = db.transaction([table], 'readwrite'),
              objectStore = writeTransaction.objectStore(table);
        // Writing in the database here!
        onOpened(objectStore)
    }
}

export const uploadSamplesToDB = async (config: samplesDBConfig, files: FileList) => {
  await processFilesForIDB(files).then((files) => {
    const onOpened = (objectStore: IDBObjectStore, _db: IDBDatabase) => {
            // @ts-ignore
            files.forEach((file: File) => {
                if (file == null) {
                    return;
                }
                objectStore.put(file);
            });
        };
        openDB(config, onOpened);
  });
};