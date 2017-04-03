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

//		try {
//			reader = Resources.getResourceAsReader("com/domain/Configuration.xml");
//			sqlSessionFactory = new SqlSessionFactoryBuilder().build(reader);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		SqlSession session = sqlSessionFactory.openSession();
//		try {
//			Newtable table = (Newtable) session.selectOne("com.domain.dao.normal.NewtableMapper.selectByPrimaryKey", 1);
//			System.out.println("data in database : name = " + table.getName());
//			System.out.println("data in database : age = " + table.getAge());
//		} finally {
//			session.close();
//		}

		
		
		System.out.println("function test over");
		model.addAttribute("name", "goood");
		return "index";
	}

//	private static SqlSessionFactory sqlSessionFactory;
//	private static Reader reader;
//
//	public static SqlSessionFactory getSession() {
//		return sqlSessionFactory;
//	}
//
//	public static void main(String[] args) {
//
//	}
}
