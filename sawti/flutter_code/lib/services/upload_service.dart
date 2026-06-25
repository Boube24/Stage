import 'dart:async';

class UploadService {
  Future<String> uploadPhoto(String localPath) async {
    // Simulate server side latency for Mauritanian local cloud server storage
    await Future.delayed(const Duration(milliseconds: 1800));
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    return "https://sawti.gov.mr/cdn/attachments/photo_$timestamp.jpg";
  }

  Future<String> uploadDocument(String localPath) async {
    await Future.delayed(const Duration(milliseconds: 2000));
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    return "https://sawti.gov.mr/cdn/attachments/doc_$timestamp.pdf";
  }
}
