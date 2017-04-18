package com.vmalta.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RootController {

	@RequestMapping("/{a1}")
	public String dispatche(@PathVariable("a1") String a1) {
		return "cn/" + a1;
	}

	@RequestMapping("/{a1}/{a2}")
	public String dispatche(@PathVariable("a1") String a1, @PathVariable("a2") String a2) {
		return "cn/" + a1 + "/" + a2;
	}

	@RequestMapping("/{a1}/{a2}/{a3}")
	public String dispatche(@PathVariable("a1") String a1, @PathVariable("a2") String a2,
			@PathVariable("a3") String a3) {
		return "cn/" + a1 + "/" + a2 + "/" + a3;
	}

	@RequestMapping("/{a1}/{a2}/{a3}/{a4}")
	public String dispatche(@PathVariable("a1") String a1, @PathVariable("a2") String a2, @PathVariable("a3") String a3,
			@PathVariable("a4") String a4) {
		return "cn/" + a1 + "/" + a2 + "/" + a3 + "/" + a4;
	}

}
