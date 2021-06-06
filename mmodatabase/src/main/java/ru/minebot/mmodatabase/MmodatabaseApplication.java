package ru.minebot.mmodatabase;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
	@PostMapping(value = "/api/getColumns")
	public List<String> getColumns(@RequestBody String body) throws JsonProcessingException {
		return jdbcTemplate.query(
				"SELECT COLUMN_NAME\n" +
					"FROM INFORMATION_SCHEMA.COLUMNS\n" +
					"WHERE TABLE_SCHEMA = 'mmo' \n" +
					"AND TABLE_NAME = '" + mapper.readValue(body, mapper.constructType(String.class)) + "';",

				(rs, rowNum) -> rs.getString(1)
		);
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/getTableRows")
	public List<Map<String, Object>> getTableRows(@RequestBody String body) throws JsonProcessingException {
		return jdbcTemplate.queryForList("SELECT * FROM " + mapper.readValue(body, mapper.constructType(String.class)) + ";");
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/addRow")
	public int getTableRows(@RequestParam String tableName, @RequestParam List<String> tableKeys, @RequestParam List<String> tableValues) {
		int idIndex = tableKeys.indexOf("id");
		if (idIndex != -1){
			tableKeys.remove(idIndex);
			tableValues.remove(idIndex);
		}

		return jdbcTemplate.update(String.format("INSERT %s (%s) VALUES (%s)", tableName, String.join(",", tableKeys), String.join(",", tableValues)));
	}
}
