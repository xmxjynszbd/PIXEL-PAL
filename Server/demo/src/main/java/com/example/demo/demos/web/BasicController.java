/*
 * Copyright 2013-2018 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.demo.demos.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;
import java.util.UUID;

/**
 * @author <a href="mailto:chenxilzx1@gmail.com">theonefx</a>
 */
@Controller
public class BasicController {
    @RequestMapping("/hello")
    @ResponseBody
    public String hello(@RequestParam(name = "name", defaultValue = "unknown user") String name) {
        return "Hello " + name;
    }





    @PostMapping(value = "/requestVideo")
    @ResponseBody
    public String fileUpload(@RequestParam(value = "file") MultipartFile file, Model model, HttpServletRequest request) {
        String prompt = request.getHeader("prompt");
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
        LCFile file = new LCFile(fileName,
                filePath,
                new HashMap<String, Object>());

        file.saveInBackground().subscribe(new Observer<LCFile>() {
            public void onSubscribe(Disposable disposable) {}
            public void onNext(LCFile file) {
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

            }
            public void onError(Throwable throwable) {
                // save err
            }
            public void onComplete() {}
        });


    }



}
