package ru.minebot.mmodatabase;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@SpringBootApplication
public class MmodatabaseApplication {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private final ObjectMapper mapper;

	public MmodatabaseApplication(ObjectMapper mapper) {
		this.mapper = mapper;
	}

	public static void main(String[] args) {
		SpringApplication.run(MmodatabaseApplication.class, args);
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@RequestMapping(value = "/api/getTables")
	public String getTables() throws JsonProcessingException {
		List<String> tables = jdbcTemplate.query(
				"SELECT `TABLE_NAME` \n" +
					"FROM information_schema.tables\n" +
					"WHERE TABLE_SCHEMA = 'mmo'\n" +
					"\tAND TABLE_TYPE = 'BASE TABLE';",
				(rs, rowNum) -> rs.getString(1)
		);

		return mapper.writeValueAsString(tables);
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/getColums")
	public String getColums(@RequestBody String body) throws JsonProcessingException {
		List<String> columns = jdbcTemplate.query(
				"SELECT COLUMN_NAME\n" +
					"FROM INFORMATION_SCHEMA.COLUMNS\n" +
					"WHERE TABLE_SCHEMA = 'mmo' \n" +
					"AND TABLE_NAME = '" + mapper.readValue(body, mapper.constructType(String.class)) + "';",

				(rs, rowNum) -> rs.getString(1)
		);
		return mapper.writeValueAsString(columns);
	}
}
