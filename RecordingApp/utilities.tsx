import RNFS from 'react-native-fs'

const removeAllAudioFiles = async () => {
    try {
        const path = `${RNFS.DocumentDirectoryPath}/`;
        const files = await RNFS.readDir(path);
        // Assuming audio files can have these extensions, add more as needed
        const audioExtensions = ['.mp3', '.wav', '.aac', '.mp4'];

        // Filter audio files
        const audioFiles = files.filter(file =>
            file.isFile() && audioExtensions.some(ext => file.name.endsWith(ext))
        );

        // Remove each audio file
        for (const file of audioFiles) {
            await RNFS.unlink(file.path)
                .then(() => {
                    console.log(`${file.name} deleted successfully`);
                })
                .catch((err) => {
                    console.error(`Failed to delete ${file.name}: ${err.message}`);
                });
        }

        console.log('All audio files removed successfully');
    } catch (error) {
        console.error('Error removing audio files', error);
    }
};

export default removeAllAudioFiles;