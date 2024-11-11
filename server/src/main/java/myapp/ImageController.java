
package main.java.myapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageRepository imageRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String filenameWithoutExt = originalFilename != null
                ? originalFilename.substring(0, originalFilename.lastIndexOf('.'))
                : "unknown";

        Image image = new Image();
        image.setFileName(filenameWithoutExt);
        image.setFileType(file.getContentType());
        image.setImageData(file.getBytes());
        imageRepository.save(image);

        return ResponseEntity.ok("Image uploaded successfully!");
    }

    @GetMapping("/")
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    @GetMapping("/download/{id}/{extension}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String id, @PathVariable String extension) {
        Optional<Image> imageOptional = imageRepository.findById(id);
        if (!imageOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Image image = imageOptional.get();
        ByteArrayResource resource = new ByteArrayResource(image.getImageData());
        String contentType = "image/" + extension;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + image.getFileName() + "." + extension + "\"")
                .body(resource);
    }
}
