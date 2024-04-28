
### Spring Boot backend server where customers upload pictures and text and AI generates videos

#### 1. Introduction

This document describes how to implement the function on a Spring Boot backend server where the customer uploads pictures and texts, the server calls the AIGC cloud function of Replicate to generate a video, and then sends the video back to the customer.

#### 2. Technology Stack

- Spring Boot

- Java

- Maven

- Replicate

- LeanCloud

#### 3. Customers upload pictures and text



##### 3.1 Implementing the file upload interface


- Create a Controller to handle customer requests to upload pictures and text
```java
@PostMapping(value = "/requestVideo")
@ResponseBody
public String fileUpload(@RequestParam(value = "file") MultipartFile file, Model model, HttpServletRequest request) 
       
```

- Use the MultipartFile class to process uploaded image files
```java
public String fileUpload(@RequestParam(value = "file") MultipartFile file, Model model, HttpServletRequest request) {
       
        if (file.isEmpty()) {
            System.out.println("empty");
        }
        String fileName = file.getOriginalFilename();  //
        String suffixName = fileName.substring(fileName.lastIndexOf("."));  //
        String filePath = "D://test//"; //
        fileName = UUID.randomUUID() + suffixName; //
        File dest = new File(filePath + fileName);
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        try {
            file.transferTo(dest);
        } catch (IOException e) {

            e.printStackTrace();
        }
```

- Receive text messages uploaded by customers
```java
 String prompt = request.getHeader("prompt");	
```

#### 4. Calling Replicate's AIGC cloud function to generate a video

##### 4.1 AIGC cloud function integrated with Replicate

- Call Leancloud to upload files
```java
 LCFile file = new LCFile(fileName,
                filePath,
                new HashMap<String, Object>());

        file.saveInBackground().subscribe(new Observer<LCFile>() {
            public void onSubscribe(Disposable disposable) {}
            public void onNext(LCFile file) {
            }
            public void onError(Throwable throwable) {
                // save err
            }
            public void onComplete() {}
        });
```

- Pass the uploaded images and text as input parameters to the AIGC cloud function
```java
                String video_url = file.getUrl();
                String apiUrl = "https://api.replicate.com/v1/predictions";
                String requestBody = "{\"version\": " +
                        "\"a01b0512004918ca55d02e554914a9eca63909fa83a29ff0f115c78a7045574f\", " +
                        "\"input\": {" +
                        "\"task\": \"image2video\" ," +
                        "\"image\": \""+video_url+"\" ," +
                        "\"prompt\": \""+prompt +"\" " +
                        "}}";

                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + REPLICATE_API_TOKEN);
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

                RestTemplate restTemplate = new RestTemplate();
                String response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class).getBody();

                System.out.println(response.data);
                return response.data;
```
#### 5. Send video back to customers

##### 5.1 Implementing the video return interface

- Return the generated video file to the client
 ```java
return response.data; // video url
```

#### 6. Deployment and testing

- Deploy Spring Boot application to the server
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/a6bea4d7c225411f92cc0f5257f8cc71.png)


- Use Postman or other tools to test the function of generating videos by uploading pictures and texts

Prompt：Singing a song
Input Image：
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/4a679aaa397442bfbda367a4b303e969.jpeg)

Reuturn video:
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e717b8af11254df8aedfc11b04edbc14.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/bf83c04f2b874282ae0ea0dad6c6f4ac.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/direct/e36c119ec4f249ab817ee39351c543b9.png)

