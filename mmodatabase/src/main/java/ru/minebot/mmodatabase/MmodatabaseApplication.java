package ru.minebot.mmodatabase;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
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
	public String getTablesHandle() throws JsonProcessingException {
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
	public List<String> getColumnsHandle(@RequestBody String body) throws JsonProcessingException {
		return getColumns(mapper.readValue(body, mapper.constructType(String.class)));
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/getTableRows")
	public List<Map<String, Object>> getTableRowsHandle(@RequestBody String body) throws JsonProcessingException {
		return jdbcTemplate.queryForList("SELECT * FROM " + mapper.readValue(body, mapper.constructType(String.class)) + ";");
	}

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/addRow")
	public int addRowHandle(@RequestBody Map<String, Object> body) {
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
	public int removeRowHandle(@RequestBody Map<String, Object> body) {
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
	public int editRowHandle(@RequestBody Map<String, Object> body) {
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

	@CrossOrigin(origins = "http://127.0.0.1:8080")
	@PostMapping(value = "/api/getJoinedTable")
	public Map<String, Object> getJoinedTableHandle(@RequestBody String body) throws JsonProcessingException {
		String tableName = mapper.readValue(body, mapper.constructType(String.class));
		List<ForeignKey> foreignKeys = getForeignKeys(tableName);
		StringBuilder query = new StringBuilder("SELECT * FROM `").append(tableName).append("`");
		List<String> fkColumns = new ArrayList<>();

		foreignKeys.forEach(foreignKey -> {
			fkColumns.add(foreignKey.columnName);
			query.append(" LEFT JOIN `")
					.append(foreignKey.referencedTableName)
					.append("` ON `")
					.append(tableName)
					.append("`.`")
					.append(foreignKey.columnName)
					.append("` = `")
					.append(foreignKey.referencedTableName)
					.append("`.`")
					.append(foreignKey.referencedColumnName)
					.append("`");
		});

		query.append(";");
		List<Map<String, Object>> result = jdbcTemplate.queryForList(query.toString());
		return new HashMap<>() {{ put("data", result); put("fk", fkColumns); }};
	}

	private List<String> getColumns(String tableName){
		return jdbcTemplate.query(
				"SELECT COLUMN_NAME\n" +
					"FROM INFORMATION_SCHEMA.COLUMNS\n" +
					"WHERE TABLE_SCHEMA = 'mmo' \n" +
					"AND TABLE_NAME = '" + tableName + "';",

				(rs, rowNum) -> rs.getString(1)
		);
	}

	private List<ForeignKey> getForeignKeys(String tableName){
		return jdbcTemplate.query(
				"SELECT k.COLUMN_NAME, k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME \n" +
						"FROM information_schema.TABLE_CONSTRAINTS i \n" +
						"LEFT JOIN information_schema.KEY_COLUMN_USAGE k ON i.CONSTRAINT_NAME = k.CONSTRAINT_NAME \n" +
						"WHERE i.CONSTRAINT_TYPE = 'FOREIGN KEY' \n" +
						"AND i.TABLE_SCHEMA = DATABASE()\n" +
						"AND i.TABLE_NAME = '" + tableName + "';\n",

				(rs, rowNum) -> new ForeignKey(
						rs.getString("COLUMN_NAME"),
						rs.getString("REFERENCED_TABLE_NAME"),
						rs.getString("REFERENCED_COLUMN_NAME")
				)
		);
	}

	private class ForeignKey {
		public String columnName;
		public String referencedTableName;
		public String referencedColumnName;

		public ForeignKey(String columnName, String referencedTableName, String referencedColumnName) {
			this.columnName = columnName;
			this.referencedTableName = referencedTableName;
			this.referencedColumnName = referencedColumnName;
		}
	}
}
