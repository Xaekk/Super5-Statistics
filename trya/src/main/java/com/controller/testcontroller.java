package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.service.TestService;

@Controller
public class testcontroller {

	private TestService testService;
	
	@Autowired
	public testcontroller(TestService testService) {
		System.out.println("test conduct");
		
		this.testService = testService;
	}

	@RequestMapping("/test")
	public String test(Model model) {
		System.out.println("function test start");
		System.out.println(testService.test());
		model.addAttribute("name", "SUCCESS!!!!!");
		model.addAttribute("name2", "goood2");
		System.out.println(model);
		System.out.println("function test over");
		return "NewFile";
	}

}
