package cn.worken.demo.config;

import cn.worken.common.config.BaseDbConfig;
import com.alibaba.druid.pool.DruidDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = {
        "cn.worken.demo.query.mapper"}, sqlSessionTemplateRef = "demoQuerySessionTemplate")
public class QueryDbConfig extends BaseDbConfig {

    @Bean(name = "demoQueryDataSource")
    public DataSource wwQueryDataSource() {
        DruidDataSource dataSource = new DruidDataSource();
        return bindDataSource(dataSource, "hrm", environment);
    }

    @Bean(name = "demoQuerySqlSessionFactory")
    public SqlSessionFactory wwQuerySqlSessionFactory(@Qualifier("demoQueryDataSource") DataSource dataSource) throws Exception {
        String[] resources = new String[]{"classpath*:mapper/query/*Mapper.xml"};
        String[] typeAliasPkg = new String[]{"cn.worken.demo.query.dto"};
        String[] typeEnumsPkg = new String[]{};

        SqlSessionFactory sessionFactory = buildSqlSessionFactory(dataSource, resources, typeAliasPkg,
                typeEnumsPkg, null);

        return sessionFactory;
    }

    @Bean(name = "demoQuerySessionTemplate")
    public SqlSessionTemplate wwQuerySessionTemplate(@Qualifier("demoQuerySqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
