package com.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.dao.normal.NewtableMapper;
import com.domain.entity.normal.Newtable;
import com.service.TestService;

@Service("testService")
public class TestServiceImpl implements TestService{
	
	NewtableMapper newtableMapper; 

	@Autowired
	public TestServiceImpl (NewtableMapper newtableMapper){
		this.newtableMapper = newtableMapper;
	}
	
	public String test(){
		System.out.println("now in TestServiceImpl");
		
		Newtable newtable = (Newtable)newtableMapper.selectByPrimaryKey(1);
		System.out.println("newtable name : "+newtable.getName()+" age : "+newtable.getAge());
		
		System.out.println("now off TestServiceImpl");
		return "TestServiceImpl";
	}
	
}
