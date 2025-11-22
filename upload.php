<?php
header('Content-Type: application/json');

// Directory to save uploads
$uploadDir = __DIR__ . '/uploads/';

// Ensure upload directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Allowed extensions for shapefile parts
$allowedExtensions = ['shp', 'shx', 'dbf'];

$response = [
    'success' => false,
    'message' => '',
    'files' => []
];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method.');
    }

    if (empty($_FILES['files'])) {
        throw new Exception('No files uploaded.');
    }

    $files = $_FILES['files'];

    // Validate all uploaded files
    for ($i = 0; $i < count($files['name']); $i++) {
        $fileName = basename($files['name'][$i]);
        $fileTmp = $files['tmp_name'][$i];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedExtensions)) {
            throw new Exception("File extension .$fileExt is not allowed.");
        }

        $targetPath = $uploadDir . $fileName;

        if (!move_uploaded_file($fileTmp, $targetPath)) {
            throw new Exception("Failed to move uploaded file: $fileName");
        }

        $response['files'][] = $fileName;
    }

    $response['success'] = true;
    $response['message'] = 'Files uploaded successfully.';
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
