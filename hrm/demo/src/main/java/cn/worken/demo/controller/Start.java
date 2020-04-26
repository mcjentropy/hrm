package cn.worken.demo.controller;

import cn.worken.common.web.response.Response;
import cn.worken.common.web.response.ResponseUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Start {

    @GetMapping("/start")
    public Response test(){
        return  ResponseUtils.success("测试成功!");
    }
}
