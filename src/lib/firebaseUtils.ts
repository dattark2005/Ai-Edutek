import { db } from '@/firebase'; // Import your Firebase configuration
import { collection, getDocs } from 'firebase/firestore';

/**
 * Fetches all data from a Firestore collection and exports it as a JSON file.
 * @param collectionName - The name of the Firestore collection to fetch data from.
 * @param fileName - The name of the JSON file to be downloaded.
 */
export const exportFirestoreDataToJson = async (collectionName: string, fileName: string) => {
  try {
    // Fetch all documents from the Firestore collection
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data: any[] = [];

    // Loop through the documents and add them to the data array
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Convert the data to a JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`Data exported successfully to ${fileName}.json`);
  } catch (error) {
    console.error("Error exporting Firestore data:", error);
  }
};