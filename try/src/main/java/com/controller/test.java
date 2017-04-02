package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.service.GoService;

@Controller
public class test {
	
	private GoService goService;
	
	@Autowired
	public test(GoService goService){
		this.goService=goService;
		System.out.println("conduct");
	}
	
//	public test(){
//		System.out.println("conduct");
//	}

	@RequestMapping("/test")
	public String go(Model model){
		System.out.println("aaaaa");
		goService.gogogo();
		System.out.println("now out inner function");
		model.addAttribute("name", "I am god");
		return "index";
	}
}
