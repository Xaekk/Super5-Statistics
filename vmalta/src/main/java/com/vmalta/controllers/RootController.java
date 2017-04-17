package com.vmalta.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RootController {

	@RequestMapping("/*")
	public String dispatche(){
		System.out.println("here");
		return "cn/index";
	}
	
//	@RequestMapping("/*/*")
//	public String dispatche2(){
//		System.out.println("here");
//		return "cn/index";
//	}
}
