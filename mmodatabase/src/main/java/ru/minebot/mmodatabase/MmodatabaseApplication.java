package ru.minebot.mmodatabase;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
	public int addRow(@RequestBody Map<String, Object> body) {
		String tableName = (String) body.get("tableName");
		ArrayList<String> tableKeys = (ArrayList<String>) body.get("tableKeys");
		ArrayList<String> tableValues = (ArrayList<String>) body.get("tableValues");

		int idIndex = tableKeys.indexOf("id");
		if (idIndex != -1){
			tableKeys.remove(idIndex);
			tableValues.remove(idIndex);
		}

		return jdbcTemplate.update(String.format("INSERT %s (%s) VALUES ('%s')", tableName, String.join(",", tableKeys), String.join("','", tableValues)));
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/removeRow")
	public int removeRow(@RequestBody Map<String, Object> body) {
		String tableName = (String) body.get("tableName");
		ArrayList<String> tableKeys = (ArrayList<String>) body.get("tableKeys");
		ArrayList<Object> tableValues = (ArrayList<Object>) body.get("tableValues");

		StringBuilder builder = new StringBuilder("DELETE FROM " + tableName + " WHERE ");
		for (int i = 0; i < tableKeys.size(); i++)
			builder.append("`").append(tableKeys.get(i)).append("`").append(" = ").append("'").append(tableValues.get(i).toString()).append("'").append(i == tableKeys.size() - 1 ? ";" : " AND ");

		return jdbcTemplate.update(builder.toString());
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/editRow")
	public int editRow(@RequestBody Map<String, Object> body) {
		String tableName = (String) body.get("tableName");
		ArrayList<String> tableKeys = (ArrayList<String>) body.get("tableKeys");
		ArrayList<Object> oldValues = (ArrayList<Object>) body.get("oldValues");
		ArrayList<Object> newValues = (ArrayList<Object>) body.get("newValues");

		StringBuilder builder = new StringBuilder("UPDATE " + tableName + " SET ");
		for (int i = 0; i < tableKeys.size(); i++){
			builder.append("`").append(tableKeys.get(i)).append("`").append(" = ").append("'").append(newValues.get(i).toString()).append("'").append(i == tableKeys.size() - 1 ? " " : ", ");
		}

		builder.append("WHERE ");
		for (int i = 0; i < tableKeys.size(); i++)
			builder.append("`").append(tableKeys.get(i)).append("`").append(" = ").append("'").append(oldValues.get(i).toString()).append("'").append(i == tableKeys.size() - 1 ? ";" : " AND ");

		return jdbcTemplate.update(builder.toString());
	}
}
