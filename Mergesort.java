public class Mergesort {

    // Main function to sort an array using merge sort
    public static void mergeSort(int[] array) {
        if (array.length > 1) {
            // Split the array into two halves
            int mid = array.length / 2;
            int[] left = new int[mid];
            int[] right = new int[array.length - mid];

            // Copy elements to left and right arrays
            System.arraycopy(array, 0, left, 0, mid);
            System.arraycopy(array, mid, right, 0, array.length - mid);

            // Recursively sort both halves
            mergeSort(left);
            mergeSort(right);

            // Merge the sorted halves
            merge(array, left, right);
        }
    }

    // Helper function to merge two sorted arrays
    private static void merge(int[] result, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;

        // Merge elements from left and right arrays
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k++] = left[i++];
            } else {
                result[k++] = right[j++];
            }
        }

        // Copy remaining elements from left (if any)
        while (i < left.length) {
            result[k++] = left[i++];
        }

        // Copy remaining elements from right (if any)
        while (j < right.length) {
            result[k++] = right[j++];
        }
    }

    public static void main(String[] args) {
        int[] numbers = {8, 3, 5, 1, 9, 2, 7, 4, 6};
        System.out.println("Original array: " + Arrays.toString(numbers));

        mergeSort(numbers);
        System.out.println("Sorted array: " + Arrays.toString(numbers));
    }
}