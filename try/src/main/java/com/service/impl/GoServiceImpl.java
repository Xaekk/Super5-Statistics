package com.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.entity.Newtable;
import com.domain.mapper.NewtableMapper;
import com.service.GoService;

@Service("goService")
public class GoServiceImpl implements GoService {

	private NewtableMapper newtableMapper;

	@Autowired
	public GoServiceImpl(NewtableMapper newtableMapper) {
		this.newtableMapper = newtableMapper;
	}

	@Override
	public String gogogo() {
		System.out.println("function gogogo start");
		
		Newtable newtable = new Newtable();
		newtable.setName("You are Smart");
		newtable.setAge(18);
		newtableMapper.insert(newtable);
		
		System.out.println("function gogogo start");
		return "gogogo";
	}

}
