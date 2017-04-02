package com.service.impl;

import org.springframework.stereotype.Service;

import com.service.GoService;

@Service("goService")
public class GoServiceImpl implements GoService {
	
	@Override
	public String gogogo(){
		System.out.println("in the function gogogo");
		return "gogogo";
	}

}
